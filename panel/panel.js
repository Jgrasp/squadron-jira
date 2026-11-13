const me = Math.random().toString(36).slice(2)
const fr = (navigator.language || '').toLowerCase().startsWith('fr')

const T = fr
  ? {
      loading: 'Chargement…',
      noAccount: 'Ajoutez un site Jira dans Réglages › Extensions › Jira : son adresse, votre e-mail et un jeton d’API.',
      setup: 'Projets Jira de ce projet',
      setupHint: 'Le panneau montre le sprint en cours des projets choisis. Les clés citées dans les commits et les branches viennent en premier.',
      filter: 'Filtrer les projets',
      mentions: (n) => `${n} mention${n > 1 ? 's' : ''}`,
      save: 'Enregistrer',
      cancel: 'Annuler',
      sprint: 'Sprint en cours',
      search: 'Chercher une clé ou un titre',
      mine: 'À moi',
      all: 'Tous',
      noSprint: 'Aucun ticket dans un sprint ouvert.',
      noMatch: 'Aucun ticket ne correspond.',
      refresh: 'Recharger',
      settings: 'Choisir les projets Jira',
      back: 'Retour au sprint',
      insert: 'Mettre dans mon message',
      brief: 'En faire une consigne',
      briefHint: 'Haiku écrit la consigne et le critère de fin, puis l’ajoute à votre message avec le ticket.',
      inserted: 'Ajouté à votre message.',
      briefing: 'Haiku écrit la consigne…',
      description: 'Description',
      subtasks: 'Sous-tâches',
      links: 'Tickets liés',
      files: 'Pièces jointes',
      comments: 'Commentaires',
      assignee: 'Assigné',
      reporter: 'Rapporteur',
      priority: 'Priorité',
      parent: 'Parent',
      sprintField: 'Sprint',
      labels: 'Étiquettes',
      components: 'Composants',
      versions: 'Versions',
      unassigned: 'Non assigné',
      opening: 'Ouverture…',
      noProjects: 'Aucun projet visible avec ce compte.',
    }
  : {
      loading: 'Loading…',
      noAccount: 'Add a Jira site in Settings › Extensions › Jira: its address, your email and an API token.',
      setup: 'Jira projects of this project',
      setupHint: 'The panel shows the open sprint of the projects you choose. Keys found in commits and branches come first.',
      filter: 'Filter projects',
      mentions: (n) => `${n} mention${n > 1 ? 's' : ''}`,
      save: 'Save',
      cancel: 'Cancel',
      sprint: 'Open sprint',
      search: 'Search a key or a title',
      mine: 'Mine',
      all: 'All',
      noSprint: 'No ticket in an open sprint.',
      noMatch: 'No ticket matches.',
      refresh: 'Reload',
      settings: 'Choose the Jira projects',
      back: 'Back to the sprint',
      insert: 'Put in my message',
      brief: 'Turn into an instruction',
      briefHint: 'Haiku writes the instruction and how to check it is done, then adds it to your message with the ticket.',
      inserted: 'Added to your message.',
      briefing: 'Haiku is writing the instruction…',
      description: 'Description',
      subtasks: 'Subtasks',
      links: 'Linked tickets',
      files: 'Attachments',
      comments: 'Comments',
      assignee: 'Assignee',
      reporter: 'Reporter',
      priority: 'Priority',
      parent: 'Parent',
      sprintField: 'Sprint',
      labels: 'Labels',
      components: 'Components',
      versions: 'Versions',
      unassigned: 'Unassigned',
      opening: 'Opening…',
      noProjects: 'No project visible with this account.',
    }

const state = {
  view: 'loading',
  accounts: [],
  sources: [],
  sprint: null,
  loading: false,
  query: '',
  mine: false,
  source: '',
  ticket: null,
  error: '',
  note: '',
  busy: '',
  thumbs: {},
  projects: {},
  mentions: {},
  chosen: [],
  filter: '',
}

const send = (type, extra = {}) => squadron.send({ ...extra, type, to: me })

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else if (k === 'class') el.className = v
    else if (k === 'style') el.style.cssText = v
    else el.setAttribute(k, v === true ? '' : v)
  }
  for (const child of children.flat(Infinity)) if (child !== null && child !== undefined && child !== false) el.append(child instanceof Node ? child : String(child))
  return el
}

const initials = (name) =>
  (name || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const RANK = { new: 0, indeterminate: 1, done: 2 }
const URGENCY = ['', '▼', '═', '▲']

function loadSprint() {
  state.loading = true
  send('sprint')
  render()
}

function openTicket(account, key) {
  state.view = 'ticket'
  state.ticket = { account, key, loading: true }
  state.error = ''
  state.note = ''
  state.busy = ''
  send('ticket', { account, key })
  render()
  scrollTo(0, 0)
}

function openSetup() {
  state.view = 'setup'
  state.chosen = state.sources.map((s) => ({ ...s }))
  state.filter = ''
  for (const a of state.accounts) if (!state.projects[a.id]) send('projects', { account: a.id })
  render()
}

squadron.on((msg) => {
  if (!msg || (msg.to !== me && msg.to !== '*')) return
  switch (msg.type) {
    case 'changed':
      return send('ready')
    case 'init':
      state.accounts = msg.accounts
      state.sources = msg.sources
      state.projects = {}
      if (!msg.accounts.length) state.view = 'noAccount'
      else if (!msg.sources.length) return openSetup()
      else {
        state.view = 'sprint'
        return loadSprint()
      }
      break
    case 'sprint':
      state.sprint = msg
      state.loading = false
      break
    case 'ticket':
      state.ticket = msg.ticket
      for (const f of msg.ticket.attachments) if (f.mime.startsWith('image/') && !state.thumbs[f.id]) send('thumb', { account: msg.ticket.account, id: f.id })
      break
    case 'thumb':
      state.thumbs[msg.id] = msg.url
      break
    case 'opened':
      state.busy = ''
      break
    case 'inserted':
    case 'briefed':
      state.busy = ''
      state.note = T.inserted
      break
    case 'projects':
      state.projects[msg.account] = msg.projects
      state.mentions = { ...state.mentions, ...msg.mentions }
      break
    case 'sources':
      state.sources = msg.sources
      state.view = 'sprint'
      return loadSprint()
    case 'error':
      if (msg.for === 'thumb') return
      if (msg.for === 'sprint') {
        state.loading = false
        state.sprint = { tickets: [], sprints: [], errors: [msg.message] }
      } else if (msg.for === 'ticket') state.ticket = { ...state.ticket, loading: false, failed: true }
      if (msg.for === 'projects') state.projects[msg.account || ''] = []
      state.busy = ''
      state.error = msg.message
      break
  }
  render()
})

function bar(title, ...buttons) {
  return h('div', { class: 'bar' }, h('h2', {}, title), ...buttons)
}

function noAccount() {
  return [bar('Jira'), h('div', { class: 'body' }, h('p', { class: 'note' }, T.noAccount))]
}

function visible() {
  const q = state.query.trim().toLowerCase()
  return (state.sprint?.tickets ?? []).filter(
    (t) =>
      (!state.mine || t.mine) &&
      (!state.source || (t.account === state.source.split(':')[0] && t.key.startsWith(`${state.source.split(':')[1]}-`))) &&
      (!q || `${t.key} ${t.title}`.toLowerCase().includes(q)),
  )
}

function ticketRow(t) {
  return h(
    'button',
    { class: 'row', onclick: () => openTicket(t.account, t.key), title: [t.kind, t.priority, t.epic].filter(Boolean).join(' · ') },
    h('span', { class: `urgency u${t.urgency}` }, URGENCY[t.urgency] || ''),
    h('span', { class: 'key' }, t.key),
    h('span', { class: 'title' }, t.title),
    h('span', { class: `who${t.mine ? ' mine' : ''}`, title: t.assignee || T.unassigned }, t.assignee ? initials(t.assignee) : '–'),
  )
}

function list() {
  const box = h('div', { class: 'body', id: 'list' })
  if (state.loading && !state.sprint) return box.append(h('p', { class: 'empty' }, T.loading)), box
  for (const e of state.sprint?.errors ?? []) box.append(h('p', { class: 'bad' }, e))
  const shown = visible()
  if (!shown.length) box.append(h('p', { class: 'empty' }, state.sprint?.tickets.length ? T.noMatch : T.noSprint))
  const groups = []
  for (const t of shown) {
    const g = groups.find((g) => g.status === t.status)
    if (g) g.tickets.push(t)
    else groups.push({ status: t.status, category: t.category, tickets: [t] })
  }
  groups.sort((a, b) => (RANK[a.category] ?? 1) - (RANK[b.category] ?? 1))
  for (const g of groups) box.append(h('h3', {}, g.status, h('small', {}, g.tickets.length)), ...g.tickets.map(ticketRow))
  return box
}

function sprintView() {
  const title = state.sprint?.sprints?.length ? state.sprint.sprints.join(' · ') : T.sprint
  const search = h('input', {
    placeholder: T.search,
    value: state.query,
    spellcheck: 'false',
    oninput: (e) => {
      state.query = e.target.value
      document.getElementById('list').replaceWith(list())
    },
  })
  const chip = (label, pressed, onclick) => h('button', { class: 'chip', 'aria-pressed': String(pressed), onclick }, label)
  const sources = state.sources.length > 1 ? state.sources.map((s) => chip(s.key, state.source === `${s.account}:${s.key}`, () => ((state.source = state.source === `${s.account}:${s.key}` ? '' : `${s.account}:${s.key}`), render()))) : []
  return [
    bar(
      title,
      h('button', { class: 'icon', title: T.refresh, 'aria-label': T.refresh, onclick: loadSprint }, h('span', { class: state.loading ? 'spin' : '' }, '↻')),
      h('button', { class: 'icon', title: T.settings, 'aria-label': T.settings, onclick: openSetup }, '⚙'),
    ),
    h('div', { class: 'tools' }, search, chip(T.mine, state.mine, () => ((state.mine = !state.mine), render())), ...sources),
    list(),
  ]
}

function keyLink(account, l, relation = '') {
  return h('button', { class: 'row', onclick: () => openTicket(account, l.key) }, relation && h('span', { class: 'relation' }, relation), h('span', { class: 'key' }, l.key), h('span', { class: 'title' }, l.title), h('span', { class: 'status' }, l.status))
}

function inline(line) {
  return line.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part) => (/^\*\*.+\*\*$/.test(part) ? h('strong', {}, part.slice(2, -2)) : /^`.+`$/.test(part) ? h('code', {}, part.slice(1, -1)) : part))
}

function rich(text) {
  return h(
    'div',
    { class: 'rich' },
    text.split(/\n{2,}/).map((block) => {
      const heading = block.match(/^#{1,6} (.*)$/)
      if (heading && !block.includes('\n')) return h('p', { class: 'heading' }, inline(heading[1]))
      return h('p', {}, block.split('\n').map((line, i) => [i ? h('br') : null, inline(line)]))
    }),
  )
}

function comment(t, c) {
  return h(
    'div',
    { class: 'comment' },
    h('header', {}, h('strong', {}, c.author || '?'), ` · ${(c.created || '').slice(0, 10)}`),
    rich(c.body),
    ...t.comments.filter((r) => r.parent === c.id).map((r) => comment(t, r)),
  )
}

function ticketView() {
  const t = state.ticket
  const back = h('button', { class: 'icon', title: T.back, 'aria-label': T.back, onclick: () => ((state.view = 'sprint'), (state.error = ''), render()) }, '←')
  if (t.loading || t.failed) return [h('div', { class: 'bar' }, back, h('h2', {}, t.key)), h('div', { class: 'body' }, state.error ? h('p', { class: 'bad' }, state.error) : h('p', { class: 'empty' }, T.loading))]
  const facts = [
    [T.assignee, t.assignee || T.unassigned],
    [T.reporter, t.reporter],
    [T.priority, t.priority],
    [T.parent, t.epic && `${t.epic.key} ${t.epic.title}`],
    [T.sprintField, t.sprint],
    [T.labels, t.labels.join(', ')],
    [T.components, t.components.join(', ')],
    [T.versions, t.versions.join(', ')],
    ...t.custom.map((f) => [f.name, f.value]),
  ].filter(([, v]) => v)
  const act = (kind) => {
    state.busy = kind
    state.note = kind === 'brief' ? T.briefing : ''
    state.error = ''
    send(kind, { account: t.account, key: t.key })
    render()
  }
  const body = h(
    'div',
    { class: 'body ticket' },
    h('div', { class: 'meta' }, h('span', { class: `status ${t.category}` }, t.status), t.kind),
    h('h2', {}, t.title),
    h('dl', { class: 'facts' }, facts.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
    h(
      'div',
      { class: 'actions' },
      h('button', { class: 'primary', disabled: !!state.busy, onclick: () => act('insert') }, T.insert),
      h('button', { disabled: !!state.busy, title: T.briefHint, onclick: () => act('brief') }, state.busy === 'brief' ? h('span', { class: 'spin' }, '↻') : null, ' ', T.brief),
    ),
    state.note && h('p', { class: 'note' }, state.note),
    state.error && h('p', { class: 'bad' }, state.error),
    t.description && [h('h3', {}, T.description), rich(t.description)],
    t.subtasks.length > 0 && [h('h3', {}, T.subtasks, h('small', {}, t.subtasks.length)), t.subtasks.map((s) => keyLink(t.account, s))],
    t.links.length > 0 && [h('h3', {}, T.links, h('small', {}, t.links.length)), t.links.map((l) => keyLink(t.account, l, l.relation))],
    t.attachments.length > 0 && [
      h('h3', {}, T.files, h('small', {}, t.attachments.length)),
      h(
        'div',
        { class: 'files' },
        t.attachments.map((f) =>
          h(
            'button',
            {
              class: 'file',
              title: `${f.name} · ${Math.max(1, Math.round(f.size / 1024))} KB`,
              disabled: !!state.busy,
              onclick: () => {
                state.busy = `open:${f.id}`
                state.error = ''
                send('open', { account: t.account, id: f.id, name: f.name })
                render()
              },
            },
            h('div', { class: 'thumb', style: state.thumbs[f.id] ? `background-image:url("${state.thumbs[f.id]}")` : '' }, state.thumbs[f.id] ? '' : (f.name.split('.').pop() || '').slice(0, 4)),
            h('span', {}, state.busy === `open:${f.id}` ? T.opening : f.name),
          ),
        ),
      ),
    ],
    t.comments.length > 0 && [h('h3', {}, T.comments, h('small', {}, t.comments.length)), t.comments.filter((c) => !c.parent).map((c) => comment(t, c))],
  )
  return [h('div', { class: 'bar' }, back, h('h2', { class: 'mono' }, t.key)), body]
}

function setupView() {
  const chosen = (account, key) => state.chosen.some((s) => s.account === account && s.key === key)
  const toggle = (account, p) => {
    state.chosen = chosen(account, p.key) ? state.chosen.filter((s) => !(s.account === account && s.key === p.key)) : [...state.chosen, { account, key: p.key, name: p.name }]
    render()
  }
  const q = state.filter.trim().toLowerCase()
  const box = h('div', { class: 'body', id: 'picks' }, h('p', { class: 'note' }, T.setupHint))
  for (const a of state.accounts) {
    box.append(h('h3', {}, a.site))
    const found = state.projects[a.id]
    if (!found) {
      box.append(h('p', { class: 'empty' }, T.loading))
      continue
    }
    if (!found.length) box.append(h('p', { class: 'empty' }, T.noProjects))
    const score = (p) => (chosen(a.id, p.key) ? 1e9 : 0) + (state.mentions[p.key] ?? 0)
    const sorted = found.filter((p) => !q || `${p.key} ${p.name}`.toLowerCase().includes(q)).sort((x, y) => score(y) - score(x) || x.key.localeCompare(y.key))
    for (const p of sorted.slice(0, 200))
      box.append(
        h(
          'label',
          { class: 'pick' },
          h('input', { type: 'checkbox', checked: chosen(a.id, p.key), onchange: () => toggle(a.id, p) }),
          h('span', { class: 'key' }, p.key),
          h('span', { class: 'title' }, p.name),
          state.mentions[p.key] ? h('small', {}, T.mentions(state.mentions[p.key])) : null,
        ),
      )
  }
  const filter = h('input', {
    placeholder: T.filter,
    value: state.filter,
    spellcheck: 'false',
    oninput: (e) => {
      state.filter = e.target.value
      const focus = document.activeElement === e.target
      render()
      if (focus) {
        const input = document.querySelector('.tools input')
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
      }
    },
  })
  return [
    bar(T.setup),
    h('div', { class: 'tools' }, filter),
    box,
    h(
      'div',
      { class: 'foot' },
      state.sources.length > 0 && h('button', { onclick: () => ((state.view = 'sprint'), render()) }, T.cancel),
      h('button', { class: 'primary', disabled: !state.chosen.length, onclick: () => send('sources', { sources: state.chosen }) }, T.save),
    ),
  ]
}

function render() {
  const app = document.getElementById('app')
  const views = { loading: () => [h('div', { class: 'body' }, h('p', { class: 'empty' }, T.loading))], noAccount, sprint: sprintView, ticket: ticketView, setup: setupView }
  app.replaceChildren(...views[state.view]().flat(Infinity).filter(Boolean))
}

render()
send('ready')
