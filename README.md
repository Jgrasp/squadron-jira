# Jira

A [Squadron](https://github.com/Jgrasp/squadron) extension that shows the open sprint of your Jira projects next to your agents, and gives your agents Jira tools.

## Use

1. In Settings › Extensions › Jira, add a Jira site: its address (`company.atlassian.net`), your email and an [API token](https://id.atlassian.com/manage-profile/security/api-tokens). Add as many sites as you need.
2. Next to an agent, click **Jira** in its tools. The first time, choose the Jira projects of this Squadron project: keys found in its commits and branches come first.

The panel lists the tickets of the open sprints, grouped by status, with a search and a **Mine** filter. A ticket shows its fields, description, subtasks, linked tickets, attachments and comments. From there:

- **Put in my message** adds the whole ticket to the message you are writing to the agent;
- **Turn into an instruction** asks Haiku for the instruction and how to check it is done, and adds them to your message with the ticket;
- an attachment opens in your app for it.

Agents get three tools:

- `jira_ticket`: a ticket as markdown, from its key;
- `jira_sprint`: the open sprint of the Jira projects linked to the project;
- `jira_search`: the tickets matching a JQL query.

## What it asks Squadron for

- `claude`, with any arguments: **Turn into an instruction** runs Claude Code on Haiku, with no tools;
- `git`, with any arguments: reads the last commits and the branches to suggest Jira projects;
- HTTPS requests to `api.media.atlassian.com`, where Jira sends attachments. The Jira sites you add need no permission.

The API token stays in the system keyring. Squadron adds it to the requests to its own site, and the extension never reads it.

Needs Squadron with the extension API 1.3.

## Build

```sh
rustup target add wasm32-wasip2
cargo build --release --target wasm32-wasip2
cargo test
```

Then add this folder in Settings › Extensions › Add an extension › A folder on this computer.
