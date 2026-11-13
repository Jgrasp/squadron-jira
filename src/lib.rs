mod jira;

use base64::Engine;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use squadron_extension_api::{Account, Agent, Extension, Request, host, squadron_extension};
use std::collections::BTreeMap;

struct Jira;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
struct Source {
    account: String,
    key: String,
    #[serde(default)]
    name: String,
}

fn field(account: &Account, name: &str) -> String {
    account
        .fields
        .iter()
        .find(|(k, _)| k == name)
        .map(|(_, v)| v.clone())
        .unwrap_or_default()
}

fn account(id: &str) -> Result<Account, String> {
    host::accounts()
        .into_iter()
        .find(|a| a.id == id)
        .ok_or_else(|| "This Jira site is no longer in Settings › Extensions.".into())
}

fn request(account: &Account, method: &str, path: &str, body: Option<Value>) -> Request {
    Request {
        method: method.into(),
        url: format!("https://{}{path}", field(account, "site")),
        headers: vec![
            (
                "Authorization".into(),
                format!("Basic {{{{base64:{0}.email:{0}.token}}}}", account.id),
            ),
            ("Accept".into(), "application/json".into()),
            ("Content-Type".into(), "application/json".into()),
        ],
        body: body.map(|b| b.to_string()),
    }
}

fn call(account: &Account, method: &str, path: &str, body: Option<Value>) -> Result<Value, String> {
    let answer = host::fetch(&request(account, method, path, body))?;
    if !(200..300).contains(&answer.status) {
        return Err(jira::jira_error(answer.status, &answer.body));
    }
    serde_json::from_str(&answer.body).map_err(|e| e.to_string())
}

fn sources(project: &str) -> Vec<Source> {
    host::state_get(&format!("sources:{project}"))
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

fn me(account: &Account) -> String {
    let key = format!("me:{}", account.id);
    if let Some(found) = host::state_get(&key) {
        return found;
    }
    let found = call(account, "GET", "/rest/api/3/myself", None)
        .map(|m| jira::text(&m["accountId"]))
        .unwrap_or_default();
    if !found.is_empty() {
        host::state_set(&key, Some(&found));
    }
    found
}

fn sprint_of(
    account: &Account,
    keys: &[String],
) -> Result<(Vec<jira::Summary>, Vec<String>), String> {
    let field = call(account, "GET", "/rest/api/3/field", None)
        .ok()
        .and_then(|f| jira::sprint_field(&f));
    let me = me(account);
    let mut fields = vec![
        "summary",
        "status",
        "assignee",
        "issuetype",
        "priority",
        "parent",
    ];
    if let Some(field) = &field {
        fields.push(field);
    }
    let jql = format!(
        "project in ({}) AND sprint in openSprints() ORDER BY project ASC, rank ASC",
        keys.join(", ")
    );
    let (mut tickets, mut sprints, mut token) = (Vec::new(), Vec::new(), None::<String>);
    loop {
        let mut body = json!({ "jql": jql, "fields": fields, "maxResults": 100 });
        if let Some(token) = &token {
            body["nextPageToken"] = json!(token);
        }
        let page = call(account, "POST", "/rest/api/3/search/jql", Some(body))?;
        for issue in page["issues"].as_array().into_iter().flatten() {
            tickets.push(jira::summary(
                issue,
                &account.id,
                &me,
                field.as_deref(),
                &mut sprints,
            ));
        }
        token = page["nextPageToken"].as_str().map(str::to_string);
        if token.is_none() || tickets.len() >= 500 {
            return Ok((tickets, sprints));
        }
    }
}

#[derive(Serialize)]
struct Sprint {
    tickets: Vec<jira::Summary>,
    sprints: Vec<String>,
    errors: Vec<String>,
}

fn sprint(project: &str) -> Sprint {
    let mut by: BTreeMap<String, Vec<String>> = BTreeMap::new();
    for source in sources(project)
        .into_iter()
        .filter(|s| jira::project_key(&s.key))
    {
        by.entry(source.account).or_default().push(source.key);
    }
    let (mut tickets, mut sprints, mut errors) = (Vec::new(), Vec::<String>::new(), Vec::new());
    for (id, keys) in by {
        match account(&id).and_then(|a| sprint_of(&a, &keys)) {
            Ok((found, names)) => {
                tickets.extend(found);
                for name in names {
                    if !sprints.contains(&name) {
                        sprints.push(name);
                    }
                }
            }
            Err(e) => errors.push(e),
        }
    }
    Sprint {
        tickets,
        sprints,
        errors,
    }
}

fn search(project: &str, jql: &str) -> Result<Vec<jira::Summary>, String> {
    let mut ids: Vec<String> = sources(project).into_iter().map(|s| s.account).collect();
    if ids.is_empty() {
        ids = host::accounts().into_iter().map(|a| a.id).collect();
    }
    ids.dedup();
    let mut found = Vec::new();
    for id in ids {
        let account = account(&id)?;
        let body = json!({ "jql": jql, "fields": ["summary", "status", "assignee", "issuetype", "priority", "parent"], "maxResults": 50 });
        let page = call(&account, "POST", "/rest/api/3/search/jql", Some(body))?;
        for issue in page["issues"].as_array().into_iter().flatten() {
            found.push(jira::summary(issue, &account.id, "", None, &mut Vec::new()));
        }
    }
    Ok(found)
}

fn ticket(account: &Account, key: &str) -> Result<jira::Ticket, String> {
    if !jira::ticket_key(key) {
        return Err(format!("{key} is not a Jira key."));
    }
    let issue = call(
        account,
        "GET",
        &format!("/rest/api/3/issue/{key}?expand=names"),
        None,
    )?;
    let mut comments = Vec::new();
    loop {
        let page = call(
            account,
            "GET",
            &format!(
                "/rest/api/3/issue/{key}/comment?startAt={}&maxResults=100&orderBy=created",
                comments.len()
            ),
            None,
        )?;
        let list = jira::comments(&page);
        let total = page["total"].as_u64().unwrap_or(0) as usize;
        let empty = list.is_empty();
        comments.extend(list);
        if empty || comments.len() >= total || comments.len() >= 1000 {
            break;
        }
    }
    Ok(jira::ticket(
        &issue,
        comments,
        &account.id,
        &field(account, "site"),
    ))
}

fn account_for(project: &str, key: &str) -> Result<Account, String> {
    let prefix = key.split('-').next().unwrap_or_default();
    let all = host::accounts();
    let id = sources(project)
        .into_iter()
        .find(|s| s.key == prefix)
        .map(|s| s.account)
        .or_else(|| all.first().map(|a| a.id.clone()))
        .ok_or("Add a Jira site in Settings › Extensions › Jira.")?;
    all.into_iter()
        .find(|a| a.id == id)
        .ok_or_else(|| "This Jira site is no longer in Settings › Extensions.".into())
}

fn projects(account: &Account) -> Result<Vec<Value>, String> {
    let mut found = Vec::new();
    loop {
        let page = call(
            account,
            "GET",
            &format!(
                "/rest/api/3/project/search?startAt={}&maxResults=100&orderBy=key",
                found.len()
            ),
            None,
        )?;
        let values = page["values"].as_array().cloned().unwrap_or_default();
        found.extend(
            values
                .iter()
                .map(|p| json!({ "key": jira::text(&p["key"]), "name": jira::text(&p["name"]) })),
        );
        if values.is_empty() || page["isLast"].as_bool().unwrap_or(true) || found.len() >= 2000 {
            return Ok(found);
        }
    }
}

fn mentions(dir: &str) -> BTreeMap<String, u32> {
    let run = |args: &[&str]| {
        let args: Vec<String> = args.iter().map(|a| a.to_string()).collect();
        host::exec("git", &args, Some(dir))
            .ok()
            .filter(|o| o.code == 0)
            .map(|o| o.stdout)
            .unwrap_or_default()
    };
    let mut found = BTreeMap::new();
    for line in run(&["log", "-200", "--format=%s %b%x00"]).split('\0') {
        for key in jira::projects_in(line) {
            *found.entry(key).or_default() += 1;
        }
    }
    for line in run(&["branch", "-a", "--format=%(refname:short)"]).lines() {
        for key in jira::projects_in(&line.to_uppercase()) {
            *found.entry(key).or_default() += 1;
        }
    }
    found
}

fn thumb(account: &Account, id: &str) -> Result<String, String> {
    if !id.chars().all(|c| c.is_ascii_digit()) {
        return Err("Invalid attachment.".into());
    }
    let answer = host::fetch_bytes(&request(
        account,
        "GET",
        &format!("/rest/api/3/attachment/thumbnail/{id}"),
        None,
    ))?;
    if answer.status != 200 {
        return Err(format!("Jira answered {}.", answer.status));
    }
    let mime = answer
        .headers
        .iter()
        .find(|(k, _)| k.eq_ignore_ascii_case("content-type"))
        .map(|(_, v)| v.split(';').next().unwrap_or_default().trim().to_string())
        .filter(|m| m.starts_with("image/"))
        .unwrap_or_else(|| "image/png".into());
    Ok(format!(
        "data:{mime};base64,{}",
        base64::engine::general_purpose::STANDARD.encode(&answer.body)
    ))
}

fn open(account: &Account, id: &str, name: &str) -> Result<(), String> {
    if !id.chars().all(|c| c.is_ascii_digit()) || id.is_empty() {
        return Err("Invalid attachment.".into());
    }
    let saved = host::download(
        &request(
            account,
            "GET",
            &format!("/rest/api/3/attachment/content/{id}"),
            None,
        ),
        &format!("attachments/{}/{id}/{}", account.id, jira::file_name(name)),
    )?;
    if !(200..300).contains(&saved.status) {
        return Err(format!("Jira answered {}.", saved.status));
    }
    host::open_file(&saved.path)
}

fn brief(dir: &str, context: &str) -> Result<(String, String), String> {
    let args: Vec<String> = [
        "-p",
        "--model",
        "haiku",
        "--output-format",
        "json",
        "--tools",
        "",
        "--strict-mcp-config",
        "--no-session-persistence",
        "--append-system-prompt",
        jira::BRIEF,
    ]
    .iter()
    .map(|a| a.to_string())
    .collect();
    let out = host::exec_input("claude", &args, Some(dir), context)?;
    jira::brief(&out.stdout).ok_or_else(|| {
        let err = out.stderr.trim();
        if err.is_empty() {
            "Haiku did not answer.".into()
        } else {
            err.to_string()
        }
    })
}

fn post(message: Value) {
    host::panel_post("main", &message.to_string());
}

fn answer(to: &str, kind: &str, agent: &Agent, message: &Value) -> Result<Value, String> {
    let text = |k: &str| message[k].as_str().unwrap_or_default().to_string();
    Ok(match kind {
        "ready" => json!({
            "type": "init",
            "project": agent.project,
            "accounts": host::accounts().iter().map(|a| json!({ "id": a.id, "site": field(a, "site") })).collect::<Vec<_>>(),
            "sources": sources(&agent.project),
        }),
        "sprint" => {
            let mut found = serde_json::to_value(sprint(&agent.project)).map_err(|e| e.to_string())?;
            found["type"] = json!("sprint");
            found
        }
        "ticket" => json!({ "type": "ticket", "ticket": ticket(&account(&text("account"))?, &text("key"))? }),
        "thumb" => json!({ "type": "thumb", "id": text("id"), "url": thumb(&account(&text("account"))?, &text("id"))? }),
        "open" => {
            open(&account(&text("account"))?, &text("id"), &text("name"))?;
            json!({ "type": "opened", "id": text("id") })
        }
        "insert" => {
            let found = ticket(&account(&text("account"))?, &text("key"))?;
            host::insert_prompt(&agent.id, &jira::context(&found));
            json!({ "type": "inserted", "key": found.key })
        }
        "brief" => {
            let found = ticket(&account(&text("account"))?, &text("key"))?;
            let context = jira::context(&found);
            let (prompt, goal) = brief(&agent.dir, &context)?;
            let goal = if goal.is_empty() { String::new() } else { format!("\n\nDone when: {goal}") };
            host::insert_prompt(&agent.id, &format!("{prompt}{goal}\n\n{context}"));
            json!({ "type": "briefed", "key": found.key })
        }
        "projects" => {
            let found = projects(&account(&text("account"))?)?;
            json!({ "type": "projects", "account": text("account"), "projects": found, "mentions": mentions(&agent.dir) })
        }
        "sources" => {
            let list: Vec<Source> = serde_json::from_value(message["sources"].clone()).map_err(|e| e.to_string())?;
            let list: Vec<Source> = list.into_iter().filter(|s| jira::project_key(&s.key)).collect();
            let saved = serde_json::to_string(&list).map_err(|e| e.to_string())?;
            host::state_set(&format!("sources:{}", agent.project), (!list.is_empty()).then_some(saved.as_str()));
            json!({ "type": "sources", "sources": list })
        }
        _ => return Err(format!("Unknown request {kind}.")),
    })
    .map(|mut v| {
        v["to"] = json!(to);
        v
    })
}

fn lines(list: &[jira::Summary]) -> String {
    if list.is_empty() {
        return "No ticket.".into();
    }
    list.iter()
        .map(|t| {
            let who = t.assignee.as_deref().unwrap_or("unassigned");
            format!("{} [{}] {} ({}, {who})", t.key, t.status, t.title, t.kind)
        })
        .collect::<Vec<_>>()
        .join("\n")
}

impl Extension for Jira {
    fn on_event(name: String, agent: Option<Agent>, data: String) {
        match name.as_str() {
            "accounts.changed" => post(json!({ "type": "changed", "to": "*" })),
            "panel.message" => {
                let data: Value = serde_json::from_str(&data).unwrap_or_default();
                let message = &data["message"];
                let (to, kind) = (jira::text(&message["to"]), jira::text(&message["type"]));
                let Some(agent) = agent else { return };
                let reply = answer(&to, &kind, &agent, message).unwrap_or_else(|error| {
                    json!({ "type": "error", "to": to, "for": kind, "account": message["account"], "key": message["key"], "id": message["id"], "message": error })
                });
                post(reply);
            }
            _ => {}
        }
    }

    fn call_tool(name: String, input: String, agent: Option<Agent>) -> Result<String, String> {
        let input: Value = serde_json::from_str(&input).unwrap_or_default();
        let project = agent.map(|a| a.project).unwrap_or_default();
        match name.as_str() {
            "ticket" => {
                let key = jira::text(&input["key"]).trim().to_uppercase();
                let account = account_for(&project, &key)?;
                Ok(jira::context(&ticket(&account, &key)?))
            }
            "sprint" => {
                if sources(&project).is_empty() {
                    return Err("No Jira project is linked to this Squadron project yet: open the Jira panel next to an agent and choose them.".into());
                }
                let found = sprint(&project);
                let mut out = lines(&found.tickets);
                for e in &found.errors {
                    out.push_str(&format!("\nError: {e}"));
                }
                Ok(out)
            }
            "search" => {
                let jql = jira::text(&input["jql"]);
                if jql.trim().is_empty() {
                    return Err("Give a JQL query.".into());
                }
                Ok(lines(&search(&project, &jql)?))
            }
            _ => Err(format!("Unknown tool {name}.")),
        }
    }
}

squadron_extension!(Jira);
