use serde::Serialize;
use serde_json::Value;

#[derive(Serialize, Debug, PartialEq)]
pub struct Summary {
    pub account: String,
    pub key: String,
    pub title: String,
    pub status: String,
    pub category: String,
    pub kind: String,
    pub priority: String,
    pub urgency: u8,
    pub epic: String,
    pub assignee: Option<String>,
    pub mine: bool,
}

#[derive(Serialize, Debug)]
pub struct Comment {
    pub id: String,
    pub parent: Option<String>,
    pub author: String,
    pub created: String,
    pub body: String,
}

#[derive(Serialize, Debug)]
pub struct Link {
    pub relation: String,
    pub key: String,
    pub title: String,
    pub status: String,
}

#[derive(Serialize, Debug)]
pub struct Field {
    pub name: String,
    pub value: String,
}

#[derive(Serialize, Debug)]
pub struct File {
    pub id: String,
    pub name: String,
    pub size: u64,
    pub mime: String,
    pub author: String,
    pub created: String,
}

#[derive(Serialize, Debug)]
pub struct Ticket {
    pub account: String,
    pub key: String,
    pub url: String,
    pub title: String,
    pub kind: String,
    pub status: String,
    pub category: String,
    pub priority: String,
    pub urgency: u8,
    pub assignee: Option<String>,
    pub reporter: Option<String>,
    pub labels: Vec<String>,
    pub components: Vec<String>,
    pub versions: Vec<String>,
    pub epic: Option<Link>,
    pub sprint: String,
    pub updated: String,
    pub description: String,
    pub subtasks: Vec<Link>,
    pub links: Vec<Link>,
    pub attachments: Vec<File>,
    pub comments: Vec<Comment>,
    pub custom: Vec<Field>,
}

pub fn text(value: &Value) -> String {
    value.as_str().unwrap_or_default().to_string()
}

fn person(value: &Value) -> Option<String> {
    value.is_object().then(|| text(&value["displayName"]))
}

pub fn urgency(priority: &Value) -> u8 {
    match priority["id"].as_str() {
        Some("1" | "2") => 3,
        Some("3") => 2,
        Some("4" | "5") => 1,
        _ => 0,
    }
}

pub fn project_key(key: &str) -> bool {
    !key.is_empty() && key.chars().all(|c| c.is_ascii_alphanumeric() || c == '_')
}

pub fn ticket_key(key: &str) -> bool {
    !key.is_empty()
        && key
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
}

pub fn summary(
    issue: &Value,
    account: &str,
    me: &str,
    sprint_field: Option<&str>,
    sprints: &mut Vec<String>,
) -> Summary {
    let f = &issue["fields"];
    if let Some(field) = sprint_field {
        for s in f[field].as_array().into_iter().flatten() {
            let name = text(&s["name"]);
            if s["state"] == "active" && !name.is_empty() && !sprints.contains(&name) {
                sprints.push(name);
            }
        }
    }
    Summary {
        account: account.to_string(),
        key: text(&issue["key"]),
        title: text(&f["summary"]),
        status: text(&f["status"]["name"]),
        category: text(&f["status"]["statusCategory"]["key"]),
        kind: text(&f["issuetype"]["name"]),
        priority: text(&f["priority"]["name"]),
        urgency: urgency(&f["priority"]),
        epic: text(&f["parent"]["fields"]["summary"]),
        assignee: person(&f["assignee"]),
        mine: !me.is_empty() && text(&f["assignee"]["accountId"]) == me,
    }
}

pub fn sprint_field(fields: &Value) -> Option<String> {
    fields.as_array()?.iter().find_map(|f| {
        (f["schema"]["custom"].as_str() == Some("com.pyxis.greenhopper.jira:gh-sprint"))
            .then(|| text(&f["id"]))
    })
}

fn link(issue: &Value, relation: String) -> Link {
    Link {
        relation,
        key: text(&issue["key"]),
        title: text(&issue["fields"]["summary"]),
        status: text(&issue["fields"]["status"]["name"]),
    }
}

fn names(list: &Value, field: &str) -> Vec<String> {
    list.as_array()
        .into_iter()
        .flatten()
        .map(|v| text(&v[field]))
        .filter(|s| !s.is_empty())
        .collect()
}

fn custom_value(value: &Value) -> String {
    match value {
        Value::Null => String::new(),
        Value::String(s) => s.clone(),
        Value::Number(n) => n.to_string(),
        Value::Bool(b) => b.to_string(),
        Value::Array(items) => items
            .iter()
            .map(custom_value)
            .filter(|s| !s.is_empty())
            .collect::<Vec<_>>()
            .join(", "),
        Value::Object(o) if o.get("type").and_then(Value::as_str) == Some("doc") => {
            adf(value).trim().to_string()
        }
        Value::Object(o) => ["value", "name", "displayName", "key"]
            .iter()
            .find_map(|k| o.get(*k).and_then(Value::as_str))
            .unwrap_or_default()
            .to_string(),
    }
}

pub fn comments(page: &Value) -> Vec<Comment> {
    page["comments"]
        .as_array()
        .into_iter()
        .flatten()
        .map(|c| Comment {
            id: custom_value(&c["id"]),
            parent: Some(custom_value(&c["parentId"])).filter(|p| !p.is_empty()),
            author: person(&c["author"]).unwrap_or_default(),
            created: text(&c["created"]),
            body: adf(&c["body"]).trim().to_string(),
        })
        .collect()
}

pub fn ticket(issue: &Value, comments: Vec<Comment>, account: &str, site: &str) -> Ticket {
    let f = &issue["fields"];
    let names_map = issue["names"].as_object().cloned().unwrap_or_default();
    let mut sprint = String::new();
    let mut custom = Vec::new();
    for (id, value) in f.as_object().into_iter().flatten() {
        if !id.starts_with("customfield_") {
            continue;
        }
        let name = names_map.get(id).map(text).unwrap_or_else(|| id.clone());
        if name == "Sprint" {
            sprint = value
                .as_array()
                .into_iter()
                .flatten()
                .next_back()
                .map(|s| text(&s["name"]))
                .unwrap_or_default();
            continue;
        }
        if ["Rank", "Development", "Team", "Parent Link", "Flagged"].contains(&name.as_str()) {
            continue;
        }
        let value = custom_value(value);
        if !value.is_empty() && !value.starts_with('{') && value.len() < 4000 {
            custom.push(Field { name, value });
        }
    }
    custom.sort_by(|a, b| a.name.cmp(&b.name));
    let mut links = Vec::new();
    for l in f["issuelinks"].as_array().into_iter().flatten() {
        if l["outwardIssue"].is_object() {
            links.push(link(&l["outwardIssue"], text(&l["type"]["outward"])));
        }
        if l["inwardIssue"].is_object() {
            links.push(link(&l["inwardIssue"], text(&l["type"]["inward"])));
        }
    }
    let key = text(&issue["key"]);
    Ticket {
        account: account.to_string(),
        url: format!("https://{site}/browse/{key}"),
        key,
        title: text(&f["summary"]),
        kind: text(&f["issuetype"]["name"]),
        status: text(&f["status"]["name"]),
        category: text(&f["status"]["statusCategory"]["key"]),
        priority: text(&f["priority"]["name"]),
        urgency: urgency(&f["priority"]),
        assignee: person(&f["assignee"]),
        reporter: person(&f["reporter"]),
        labels: f["labels"]
            .as_array()
            .into_iter()
            .flatten()
            .map(text)
            .collect(),
        components: names(&f["components"], "name"),
        versions: names(&f["fixVersions"], "name"),
        epic: f["parent"].is_object().then(|| {
            link(
                &f["parent"],
                text(&f["parent"]["fields"]["issuetype"]["name"]),
            )
        }),
        sprint,
        updated: text(&f["updated"]),
        description: adf(&f["description"]).trim().to_string(),
        subtasks: f["subtasks"]
            .as_array()
            .into_iter()
            .flatten()
            .map(|s| link(s, String::new()))
            .collect(),
        links,
        attachments: f["attachment"]
            .as_array()
            .into_iter()
            .flatten()
            .map(|a| File {
                id: custom_value(&a["id"]),
                name: text(&a["filename"]),
                size: a["size"].as_u64().unwrap_or(0),
                mime: text(&a["mimeType"]),
                author: text(&a["author"]["displayName"]),
                created: text(&a["created"]),
            })
            .collect(),
        comments,
        custom,
    }
}

pub fn adf(node: &Value) -> String {
    let mut out = String::new();
    block(node, &mut out, "");
    out
}

fn children(node: &Value) -> impl Iterator<Item = &Value> {
    node["content"].as_array().into_iter().flatten()
}

fn inline(node: &Value) -> String {
    children(node).map(span).collect()
}

fn span(node: &Value) -> String {
    let attrs = &node["attrs"];
    match node["type"].as_str().unwrap_or_default() {
        "text" => {
            let mut s = text(&node["text"]);
            for mark in node["marks"].as_array().into_iter().flatten() {
                s = match mark["type"].as_str().unwrap_or_default() {
                    "strong" => format!("**{s}**"),
                    "em" => format!("*{s}*"),
                    "strike" => format!("~~{s}~~"),
                    "code" => format!("`{s}`"),
                    "link" => format!("[{s}]({})", text(&mark["attrs"]["href"])),
                    _ => s,
                };
            }
            s
        }
        "hardBreak" => "  \n".into(),
        "mention" => {
            let name = text(&attrs["text"]);
            if name.starts_with('@') {
                name
            } else {
                format!("@{name}")
            }
        }
        "emoji" => {
            let t = text(&attrs["text"]);
            if t.is_empty() {
                text(&attrs["shortName"])
            } else {
                t
            }
        }
        "inlineCard" | "blockCard" | "embedCard" => text(&attrs["url"]),
        "status" => format!("[{}]", text(&attrs["text"])),
        "date" => attrs["timestamp"]
            .as_str()
            .and_then(|t| t.parse::<i64>().ok())
            .map(|ms| day(ms.div_euclid(86_400_000)))
            .unwrap_or_default(),
        "media" | "mediaInline" => {
            let alt = text(&attrs["alt"]);
            format!(
                "[{}]",
                if alt.is_empty() {
                    "attachment".into()
                } else {
                    alt
                }
            )
        }
        _ => inline(node),
    }
}

fn day(days: i64) -> String {
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = yoe + era * 400 + i64::from(m <= 2);
    format!("{y:04}-{m:02}-{d:02}")
}

fn block(node: &Value, out: &mut String, indent: &str) {
    let push = |out: &mut String, s: &str| {
        for (i, line) in s.lines().enumerate() {
            if i > 0 || out.ends_with('\n') || out.is_empty() {
                out.push_str(indent);
            }
            out.push_str(line);
            out.push('\n');
        }
    };
    match node["type"].as_str().unwrap_or_default() {
        "doc" | "panel" | "layoutSection" | "layoutColumn" | "expand" | "nestedExpand" => {
            if node["type"] == "expand" || node["type"] == "nestedExpand" {
                let title = text(&node["attrs"]["title"]);
                if !title.is_empty() {
                    push(out, &format!("**{title}**"));
                    out.push('\n');
                }
            }
            for child in children(node) {
                block(child, out, indent);
            }
        }
        "paragraph" => {
            push(out, &inline(node));
            out.push('\n');
        }
        "heading" => {
            let level = node["attrs"]["level"].as_u64().unwrap_or(2).clamp(1, 6) as usize;
            push(out, &format!("{} {}", "#".repeat(level), inline(node)));
            out.push('\n');
        }
        "bulletList" | "orderedList" | "taskList" => {
            let ordered = node["type"] == "orderedList";
            for (i, item) in children(node).enumerate() {
                let marker = if ordered {
                    format!("{}. ", i + 1)
                } else if item["type"] == "taskItem" {
                    if item["attrs"]["state"] == "DONE" {
                        "- [x] ".into()
                    } else {
                        "- [ ] ".into()
                    }
                } else {
                    "- ".into()
                };
                let mut inner = String::new();
                if item["type"] == "taskItem" {
                    inner.push_str(&inline(item));
                } else {
                    for child in children(item) {
                        block(child, &mut inner, "");
                    }
                }
                let inner = inner.trim_end();
                let pad = " ".repeat(marker.len());
                for (j, line) in inner.lines().filter(|l| !l.is_empty()).enumerate() {
                    out.push_str(indent);
                    out.push_str(if j == 0 { &marker } else { &pad });
                    out.push_str(line);
                    out.push('\n');
                }
            }
            out.push('\n');
        }
        "codeBlock" => {
            let language = text(&node["attrs"]["language"]);
            push(out, &format!("```{language}"));
            let code: String = children(node).map(|c| text(&c["text"])).collect();
            push(out, &code);
            push(out, "```");
            out.push('\n');
        }
        "blockquote" => {
            let mut inner = String::new();
            for child in children(node) {
                block(child, &mut inner, "");
            }
            for line in inner.trim_end().lines() {
                push(out, &format!("> {line}"));
            }
            out.push('\n');
        }
        "rule" => {
            push(out, "---");
            out.push('\n');
        }
        "table" => {
            let rows: Vec<Vec<String>> = children(node)
                .map(|row| {
                    children(row)
                        .map(|cell| {
                            let mut inner = String::new();
                            for child in children(cell) {
                                block(child, &mut inner, "");
                            }
                            inner
                                .split_whitespace()
                                .collect::<Vec<_>>()
                                .join(" ")
                                .replace('|', "\\|")
                        })
                        .collect()
                })
                .collect();
            for (i, row) in rows.iter().enumerate() {
                push(out, &format!("| {} |", row.join(" | ")));
                if i == 0 {
                    push(out, &format!("|{}", " --- |".repeat(row.len())));
                }
            }
            out.push('\n');
        }
        "mediaSingle" | "mediaGroup" => {
            push(out, &inline(node));
            out.push('\n');
        }
        _ => {
            let s = span(node);
            if !s.is_empty() {
                push(out, &s);
                out.push('\n');
            }
        }
    }
}

pub fn context(ticket: &Ticket) -> String {
    let mut out = format!(
        "<ticket source=\"jira\" key=\"{}\" url=\"{}\">\n# {} {}\n",
        ticket.key, ticket.url, ticket.key, ticket.title
    );
    let mut facts = vec![format!("Type: {}", ticket.kind)];
    if !ticket.priority.is_empty() {
        facts.push(format!("Priority: {}", ticket.priority));
    }
    facts.push(format!("Status: {}", ticket.status));
    if let Some(p) = &ticket.assignee {
        facts.push(format!("Assignee: {p}"));
    }
    if let Some(p) = &ticket.reporter {
        facts.push(format!("Reporter: {p}"));
    }
    for (label, list) in [
        ("Labels", &ticket.labels),
        ("Components", &ticket.components),
        ("Fix versions", &ticket.versions),
    ] {
        if !list.is_empty() {
            facts.push(format!("{label}: {}", list.join(", ")));
        }
    }
    if let Some(e) = &ticket.epic {
        facts.push(format!("Parent: {} {}", e.key, e.title));
    }
    for f in &ticket.custom {
        facts.push(format!("{}: {}", f.name, f.value));
    }
    for fact in facts {
        out.push_str(&format!("- {fact}\n"));
    }
    if !ticket.description.is_empty() {
        out.push_str(&format!("\n## Description\n{}\n", ticket.description));
    }
    if !ticket.subtasks.is_empty() {
        out.push_str("\n## Subtasks\n");
        for s in &ticket.subtasks {
            out.push_str(&format!("- {} {} ({})\n", s.key, s.title, s.status));
        }
    }
    if !ticket.links.is_empty() {
        out.push_str("\n## Linked tickets\n");
        for l in &ticket.links {
            out.push_str(&format!(
                "- {} {} {} ({})\n",
                l.relation, l.key, l.title, l.status
            ));
        }
    }
    if !ticket.attachments.is_empty() {
        let names: Vec<&str> = ticket.attachments.iter().map(|a| a.name.as_str()).collect();
        out.push_str(&format!("\n## Attachments\n{}\n", names.join(", ")));
    }
    if !ticket.comments.is_empty() {
        out.push_str("\n## Comments\n");
        for c in ticket.comments.iter().filter(|c| c.parent.is_none()) {
            comment(&mut out, ticket, c, "");
        }
    }
    out.push_str("</ticket>");
    out
}

fn comment(out: &mut String, ticket: &Ticket, c: &Comment, indent: &str) {
    let date = c.created.get(..10).unwrap_or_default();
    let body = c
        .body
        .lines()
        .collect::<Vec<_>>()
        .join(&format!("\n{indent}  "));
    out.push_str(&format!("{indent}- {} ({date}): {body}\n", c.author));
    for reply in ticket
        .comments
        .iter()
        .filter(|r| r.parent.as_deref() == Some(c.id.as_str()))
    {
        comment(out, ticket, reply, &format!("{indent}  "));
    }
}

pub fn projects_in(text: &str) -> Vec<String> {
    let bytes = text.as_bytes();
    let mut keys = Vec::new();
    let mut i = 0;
    while i < bytes.len() {
        let start = i;
        if bytes[i].is_ascii_uppercase() && (i == 0 || !bytes[i - 1].is_ascii_alphanumeric()) {
            while i < bytes.len()
                && (bytes[i].is_ascii_uppercase() || bytes[i].is_ascii_digit() || bytes[i] == b'_')
            {
                i += 1;
            }
            if i + 1 < bytes.len()
                && bytes[i] == b'-'
                && bytes[i + 1].is_ascii_digit()
                && i - start >= 2
            {
                let key = text[start..i].to_string();
                if !keys.contains(&key) {
                    keys.push(key);
                }
            }
        }
        i += 1;
    }
    keys
}

pub fn file_name(name: &str) -> String {
    let clean: String = name
        .chars()
        .map(|c| {
            if c.is_control() || matches!(c, '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|') {
                '_'
            } else {
                c
            }
        })
        .collect();
    let clean = clean.trim().trim_start_matches('.').to_string();
    if clean.is_empty() {
        "attachment".into()
    } else {
        clean
    }
}

pub const BRIEF: &str = "You turn a Jira ticket into the instruction a coding agent receives in this repository. Write in the language the ticket is written in. Reply with JSON only, no code fence: {\"prompt\": \"...\", \"goal\": \"...\"}. prompt: what to do, in a short paragraph then a dash list of the concrete requirements, constraints and decisions taken in the comments (latest decision wins). Mention the ticket key once. No preamble, no restating the title. goal: one sentence saying how to check the work is finished.";

pub fn brief(reply: &str) -> Option<(String, String)> {
    let result: Value = serde_json::from_str(reply).ok()?;
    let result = text(&result["result"]);
    let start = result.find('{')?;
    let end = result.rfind('}')?;
    let brief: Value = serde_json::from_str(result.get(start..=end)?).ok()?;
    let prompt = text(&brief["prompt"]).trim().to_string();
    (!prompt.is_empty()).then(|| (prompt, text(&brief["goal"]).trim().to_string()))
}

pub fn jira_error(status: u16, body: &str) -> String {
    match status {
        401 => "Jira refused this email and token.".into(),
        403 => "Jira refused: this account may not see it.".into(),
        404 => "Jira did not find this ticket or project.".into(),
        _ => serde_json::from_str::<Value>(body)
            .ok()
            .and_then(|b| {
                b["errorMessages"]
                    .as_array()?
                    .first()?
                    .as_str()
                    .map(|m| format!("Jira: {m}"))
            })
            .unwrap_or_else(|| format!("Jira answered {status}.")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn issue() -> Value {
        json!({
            "key": "RING-12",
            "names": { "customfield_1": "Sprint", "customfield_2": "Story points", "customfield_3": "Rank" },
            "fields": {
                "summary": "Pay by card",
                "status": { "name": "In Progress", "statusCategory": { "key": "indeterminate" } },
                "issuetype": { "name": "Story" },
                "priority": { "id": "2", "name": "High" },
                "assignee": { "displayName": "Ada", "accountId": "me" },
                "reporter": { "displayName": "Bob" },
                "labels": ["checkout"],
                "parent": { "key": "RING-1", "fields": { "summary": "Payments", "issuetype": { "name": "Epic" }, "status": { "name": "To Do" } } },
                "customfield_1": [{ "name": "Sprint 3", "state": "closed" }, { "name": "Sprint 4", "state": "active" }],
                "customfield_2": 5,
                "customfield_3": "0|i0",
                "description": { "type": "doc", "content": [
                    { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Goal" }] },
                    { "type": "paragraph", "content": [{ "type": "text", "text": "Use ", "marks": [] }, { "type": "text", "text": "Stripe", "marks": [{ "type": "strong" }] }] },
                    { "type": "bulletList", "content": [{ "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "3DS" }] }] }] }
                ] },
                "attachment": [{ "id": "100", "filename": "flow.png", "size": 2048, "mimeType": "image/png", "author": { "displayName": "Bob" }, "created": "2026-11-01" }],
                "issuelinks": [{ "type": { "outward": "blocks", "inward": "is blocked by" }, "outwardIssue": { "key": "RING-13", "fields": { "summary": "Refunds", "status": { "name": "To Do" } } } }]
            }
        })
    }

    #[test]
    fn reads_a_ticket_and_writes_its_context() {
        let comments = comments(&json!({ "comments": [
            { "id": "1", "author": { "displayName": "Bob" }, "created": "2026-11-02T10:00", "body": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "No PayPal." }] }] } },
            { "id": 2, "parentId": 1, "author": { "displayName": "Ada" }, "created": "2026-11-03T10:00", "body": { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Agreed." }] }] } }
        ] }));
        let t = ticket(&issue(), comments, "a1", "acme.atlassian.net");
        assert_eq!(t.url, "https://acme.atlassian.net/browse/RING-12");
        assert_eq!(t.sprint, "Sprint 4");
        assert_eq!(t.urgency, 3);
        assert_eq!(t.custom.len(), 1);
        assert_eq!(t.description, "## Goal\n\nUse **Stripe**\n\n- 3DS");
        let c = context(&t);
        assert!(c.starts_with("<ticket source=\"jira\" key=\"RING-12\" url=\"https://acme.atlassian.net/browse/RING-12\">\n# RING-12 Pay by card\n"));
        assert!(c.contains("- Parent: RING-1 Payments\n"));
        assert!(c.contains("- Story points: 5\n"));
        assert!(c.contains("- blocks RING-13 Refunds (To Do)\n"));
        assert!(c.contains("- Bob (2026-11-02): No PayPal.\n  - Ada (2026-11-03): Agreed.\n"));
        assert!(c.ends_with("</ticket>"));
    }

    #[test]
    fn sums_up_a_sprint_ticket() {
        let mut sprints = vec![];
        let s = summary(&issue(), "a1", "me", Some("customfield_1"), &mut sprints);
        assert_eq!(sprints, ["Sprint 4"]);
        assert!(s.mine);
        assert_eq!(s.epic, "Payments");
        assert_eq!(s.assignee.as_deref(), Some("Ada"));
        let field = sprint_field(
            &json!([{ "id": "customfield_9", "schema": { "custom": "com.pyxis.greenhopper.jira:gh-sprint" } }]),
        );
        assert_eq!(field.as_deref(), Some("customfield_9"));
    }

    #[test]
    fn finds_project_keys_and_cleans_names() {
        assert_eq!(
            projects_in("RING-12 fix, see SHOP-3 and RING-4; not A-1 nor ab-2"),
            ["RING", "SHOP"]
        );
        assert_eq!(file_name("../a/b:c.png"), "_a_b_c.png");
        assert_eq!(file_name(".."), "attachment");
        assert!(ticket_key("RING-12") && !ticket_key("RING 12") && !ticket_key("../x"));
        assert!(project_key("RING") && !project_key("RING)"));
    }

    #[test]
    fn reads_the_brief_and_jira_errors() {
        let reply = json!({ "result": "```json\n{\"prompt\": \"Add card payments for RING-12.\", \"goal\": \"A card payment goes through.\"}\n```" }).to_string();
        assert_eq!(
            brief(&reply),
            Some((
                "Add card payments for RING-12.".into(),
                "A card payment goes through.".into()
            ))
        );
        assert_eq!(brief("{}"), None);
        assert_eq!(
            jira_error(400, r#"{"errorMessages":["Bad JQL"]}"#),
            "Jira: Bad JQL"
        );
        assert_eq!(jira_error(500, ""), "Jira answered 500.");
    }
}
