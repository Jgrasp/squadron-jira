const me = Math.random().toString(36).slice(2)
const fr = (navigator.language || '').toLowerCase().startsWith('fr')

const T = fr
  ? {
      loading: 'Chargement…',
      noAccount: 'Ajoutez un site Jira dans Réglages › Extensions › Jira : son adresse, votre e-mail et un jeton d’API.',
      setup: 'Projets Jira de ce projet',
      setupHint: 'Le panneau montre le sprint en cours des projets choisis. Les clés citées dans les commits et les branches viennent en premier.',
      filter: 'Filtrer les projets',
      mentions: (n) => `${n} mention${n > 1 ? 's' : ''}`,
      save: 'Enregistrer',
      cancel: 'Annuler',
      sprint: 'Sprint en cours',
      search: 'Chercher une clé ou un titre',
      mine: 'À moi',
      mineOnly: 'Seulement les miens',
      noSprint: 'Aucun ticket dans un sprint ouvert.',
      noMatch: 'Aucun ticket ne correspond.',
      refresh: 'Recharger',
      settings: 'Choisir les projets Jira',
      back: 'Retour au sprint',
      list: 'Liste',
      board: 'Tableau',
      view: 'Vue',
      insert: 'Mettre dans mon message',
      brief: 'En faire une consigne',
      briefHint: 'Haiku écrit la consigne et le critère de fin, puis l’ajoute à votre message avec le ticket.',
      launch: 'Lancer un agent',
      launchHint: 'Ouvre la fenêtre Nouvel agent, que Haiku remplit à partir du ticket.',
      launching: 'Haiku prépare la consigne…',
      launched: (name) => `Agent « ${name} » lancé.`,
      started: 'Agent lancé',
      inserted: 'Ajouté à votre message.',
      briefing: 'Haiku écrit la consigne…',
      description: 'Description',
      subtasks: 'Sous-tâches',
      links: 'Tickets liés',
      files: 'Pièces jointes',
      comments: 'Commentaires',
      searchComments: 'Chercher dans les commentaires',
      newest: 'Récents',
      oldest: 'Anciens',
      threads: (shown, total) => `${shown} fil${shown > 1 ? 's' : ''} sur ${total}`,
      noComment: 'Aucun commentaire.',
      assignee: 'Assigné',
      reporter: 'Rapporteur',
      priority: 'Priorité',
      kind: 'Type',
      status: 'Statut',
      epic: 'Epic',
      noEpic: 'Sans epic',
      noPriority: 'Sans priorité',
      project: 'Projet',
      allProjects: 'Tous les projets',
      show: 'Afficher',
      parent: 'Parent',
      sprintField: 'Sprint',
      labels: 'Étiquettes',
      components: 'Composants',
      versions: 'Versions',
      updated: 'Mis à jour',
      unassigned: 'Non assigné',
      opening: 'Ouverture…',
      noProjects: 'Aucun projet visible avec ce compte.',
      shown: (shown, total) => `${shown} sur ${total}`,
      count: (n) => `${n} ticket${n > 1 ? 's' : ''}`,
      reset: 'Réinitialiser les filtres',
      filters: 'Filtres',
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
      mineOnly: 'Mine only',
      noSprint: 'No ticket in an open sprint.',
      noMatch: 'No ticket matches.',
      refresh: 'Reload',
      settings: 'Choose the Jira projects',
      back: 'Back to the sprint',
      list: 'List',
      board: 'Board',
      view: 'View',
      insert: 'Put in my message',
      brief: 'Turn into an instruction',
      briefHint: 'Haiku writes the instruction and how to check it is done, then adds it to your message with the ticket.',
      launch: 'Launch agent',
      launchHint: 'Opens the New agent window, filled by Haiku from the ticket.',
      launching: 'Haiku is preparing the instructions…',
      launched: (name) => `Agent “${name}” started.`,
      started: 'Agent started',
      inserted: 'Added to your message.',
      briefing: 'Haiku is writing the instruction…',
      description: 'Description',
      subtasks: 'Subtasks',
      links: 'Linked tickets',
      files: 'Attachments',
      comments: 'Comments',
      searchComments: 'Search the comments',
      newest: 'Newest',
      oldest: 'Oldest',
      threads: (shown, total) => `${shown} of ${total} threads`,
      noComment: 'No comment.',
      assignee: 'Assignee',
      reporter: 'Reporter',
      priority: 'Priority',
      kind: 'Type',
      status: 'Status',
      epic: 'Epic',
      noEpic: 'No epic',
      noPriority: 'No priority',
      project: 'Project',
      allProjects: 'All projects',
      show: 'Show',
      parent: 'Parent',
      sprintField: 'Sprint',
      labels: 'Labels',
      components: 'Components',
      versions: 'Versions',
      updated: 'Updated',
      unassigned: 'Unassigned',
      opening: 'Opening…',
      noProjects: 'No project visible with this account.',
      shown: (shown, total) => `${shown} of ${total}`,
      count: (n) => `${n} ticket${n > 1 ? 's' : ''}`,
      reset: 'Reset filters',
      filters: 'Filters',
    }

const emptyFilters = () => ({ mine: false, people: [], hidden: { status: [], kind: [], priority: [], epic: [] } })

const state = {
  view: 'loading',
  layout: 'list',
  project: '',
  accounts: [],
  sources: [],
  launched: {},
  sprint: null,
  loading: false,
  query: '',
  source: '',
  f: emptyFilters(),
  ticket: null,
  commentQuery: '',
  newest: true,
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
    else if (k === 'checked' || k === 'value') el[k] = v
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
const FACETS = [
  ['kind', T.kind],
  ['priority', T.priority],
  ['epic', T.epic],
]
const tone = (kind) => (/bug|anomal/i.test(kind) ? 'bug' : /stor|récit|recit/i.test(kind) ? 'story' : /epic|épopée|epopee/i.test(kind) ? 'epic' : 'task')
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
const inSource = (t, s) => t.account === s.account && t.key.startsWith(`${s.key}-`)

function avatar(name, mine) {
  return name ? h('span', { class: `who${mine ? ' mine' : ''}`, title: name }, initials(name)) : h('span', { class: 'who nobody', title: T.unassigned }, '?')
}

function columnsOf(list) {
  const groups = []
  for (const t of list) {
    const g = groups.find((g) => g.status === t.status)
    if (g) g.tickets.push(t)
    else groups.push({ status: t.status, category: t.category, tickets: [t] })
  }
  return groups.sort((a, b) => (RANK[a.category] ?? 1) - (RANK[b.category] ?? 1))
}

function loadSprint() {
  state.loading = true
  send('sprint')
  render()
}

function openTicket(account, key) {
  state.view = 'ticket'
  state.ticket = { account, key, loading: true }
  state.commentQuery = ''
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

function launch(t) {
  state.busy = `launch:${t.key}`
  state.error = ''
  state.note = state.view === 'ticket' ? T.launching : ''
  send('launch', { account: t.account, key: t.key, title: t.title })
  render()
}

squadron.on((msg) => {
  if (!msg || (msg.to !== me && msg.to !== '*')) return
  switch (msg.type) {
    case 'changed':
      return send('ready')
    case 'init':
      state.project = msg.project
      state.accounts = msg.accounts
      state.sources = msg.sources
      state.launched = msg.launched || {}
      state.layout = msg.view === 'board' ? 'board' : 'list'
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
    case 'launch':
      state.busy = ''
      if (msg.type === 'launch') state.note = ''
      break
    case 'launched':
      if (msg.project !== state.project) return
      state.launched = { ...state.launched, [msg.key]: msg.agent }
      if (state.view === 'ticket' && state.ticket?.key === msg.key) state.note = T.launched(msg.agent)
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
      state.source = ''
      state.f = emptyFilters()
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
      state.note = ''
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

function scope() {
  const source = state.sources.find((s) => `${s.account}:${s.key}` === state.source)
  const all = state.sprint?.tickets ?? []
  return source ? all.filter((t) => inSource(t, source)) : all
}

function everyone(list) {
  const names = [...new Set(list.map((t) => t.assignee).filter(Boolean))].sort()
  return [...names, ...(list.some((t) => !t.assignee) ? [''] : [])]
}

function visible() {
  const q = state.query.trim().toLowerCase()
  const f = state.f
  return scope().filter(
    (t) =>
      (!f.mine || t.mine) &&
      (!f.people.length || f.people.includes(t.assignee || '')) &&
      !f.hidden.status.includes(t.status) &&
      FACETS.every(([k]) => !f.hidden[k].includes(t[k])) &&
      (!q || `${t.key} ${t.title}`.toLowerCase().includes(q)),
  )
}

const filtered = () => {
  const f = state.f
  return f.mine || f.people.length || state.query.trim() || Object.values(f.hidden).some((l) => l.length)
}

function reset() {
  state.f = emptyFilters()
  state.query = ''
  render()
}

function ticketRow(t) {
  return h(
    'button',
    { class: 'row', onclick: () => openTicket(t.account, t.key), title: [t.kind, t.priority, t.epic].filter(Boolean).join(' · ') },
    h('span', { class: `urgency u${t.urgency}` }, URGENCY[t.urgency] || ''),
    h('span', { class: 'key' }, t.key),
    h('span', { class: 'title' }, t.title),
    avatar(t.assignee, t.mine),
  )
}

function list() {
  const box = h('div', { class: 'body', id: 'list' })
  if (state.loading && !state.sprint) return box.append(h('p', { class: 'empty' }, T.loading)), box
  for (const e of state.sprint?.errors ?? []) box.append(h('p', { class: 'bad' }, e))
  const shown = visible()
  if (!shown.length) box.append(h('p', { class: 'empty' }, state.sprint?.tickets.length ? T.noMatch : T.noSprint))
  for (const g of columnsOf(shown)) box.append(h('h3', {}, g.status, h('small', {}, g.tickets.length)), ...g.tickets.map(ticketRow))
  return box
}

function card(t) {
  const busy = state.busy === `launch:${t.key}`
  const agent = state.launched[t.key]
  return h(
    'li',
    { class: 'card' },
    h(
      'button',
      { class: 'open', title: t.title, onclick: () => openTicket(t.account, t.key) },
      h(
        'span',
        { class: 'meta' },
        h('span', { class: `kind ${tone(t.kind)}`, title: t.kind }, (t.kind[0] || '?').toUpperCase()),
        h('span', { class: 'key' }, t.key),
        t.urgency > 0 && h('span', { class: `urgency u${t.urgency}`, title: t.priority }, URGENCY[t.urgency]),
        t.epic && h('span', { class: 'epic' }, t.epic),
      ),
      h('span', { class: 'name' }, t.title),
    ),
    h(
      'span',
      { class: 'cfoot' },
      h('button', { class: 'action', disabled: !!state.busy, title: T.launchHint, onclick: () => launch(t) }, busy ? h('span', { class: 'spin' }, '↻') : '→', T.launch),
      agent && h('span', { class: 'started', title: agent }, T.started),
      h('span', { class: 'assignee' }, avatar(t.assignee, t.mine)),
    ),
  )
}

function rail() {
  const all = state.sprint?.tickets ?? []
  const list = scope()
  const tally = (match) => list.filter(match).length
  const f = state.f
  const people = everyone(list)
  const listed = (n) => !f.people.length || f.people.includes(n)
  const check = (checked, onchange, ...label) => h('label', { class: 'opt' }, h('input', { type: 'checkbox', checked, onchange }), ...label)
  const section = (title, ...items) => h('section', {}, h('h3', {}, title), ...items)
  return h(
    'aside',
    { class: 'rail', 'aria-label': T.filters },
    state.sources.length > 1 &&
      section(
        T.project,
        h('button', { class: 'opt', 'aria-pressed': String(!state.source), onclick: () => ((state.source = ''), (state.f = emptyFilters()), render()) }, T.allProjects, h('small', {}, all.length)),
        state.sources.map((s) =>
          h(
            'button',
            { class: 'opt', 'aria-pressed': String(state.source === `${s.account}:${s.key}`), onclick: () => ((state.source = `${s.account}:${s.key}`), (state.f = emptyFilters()), render()) },
            h('span', { class: 'label' }, s.name || s.key),
            h('span', { class: 'tag' }, s.key),
            h('small', {}, all.filter((t) => inSource(t, s)).length),
          ),
        ),
      ),
    section(T.show, check(f.mine, (e) => ((f.mine = e.target.checked), render()), T.mineOnly, h('small', {}, tally((t) => t.mine)))),
    section(
      T.status,
      columnsOf(list).map((c) => check(!f.hidden.status.includes(c.status), () => ((f.hidden.status = toggle(f.hidden.status, c.status)), render()), h('span', { class: `status ${c.category}` }, c.status), h('small', {}, c.tickets.length))),
    ),
    people.length > 0 &&
      section(
        T.assignee,
        people.map((n) =>
          check(
            listed(n),
            () => {
              const next = toggle(f.people.length ? f.people : people, n)
              f.people = next.length === people.length ? [] : next
              render()
            },
            avatar(n),
            h('span', { class: 'label' }, n || T.unassigned),
            h('small', {}, tally((t) => (t.assignee || '') === n)),
          ),
        ),
      ),
    FACETS.map(([k, title]) => {
      const values = [...new Set(list.map((t) => t[k]))]
      if (!values.length) return null
      return section(
        title,
        values.map((v) => {
          const u = list.find((t) => t.priority === v)?.urgency ?? 0
          return check(
            !f.hidden[k].includes(v),
            () => ((f.hidden[k] = toggle(f.hidden[k], v)), render()),
            k === 'kind' && h('span', { class: `kind ${tone(v)}` }, (v[0] || '?').toUpperCase()),
            k === 'priority' && u > 0 && h('span', { class: `urgency u${u}` }, URGENCY[u]),
            k === 'epic' && v ? h('span', { class: 'epic' }, v) : h('span', { class: 'label' }, v || (k === 'epic' ? T.noEpic : k === 'priority' ? T.noPriority : '—')),
            h('small', {}, tally((t) => t[k] === v)),
          )
        }),
      )
    }),
  )
}

function columns() {
  const box = h('div', { class: 'columns', id: 'list' })
  if (state.loading && !state.sprint) return box.append(h('p', { class: 'empty' }, T.loading)), box
  const shown = visible()
  if (!shown.length) {
    box.className = 'nothing'
    box.append(h('p', { class: 'empty' }, state.sprint?.tickets.length ? T.noMatch : T.noSprint), filtered() && h('button', { onclick: reset }, T.reset))
    return box
  }
  for (const c of columnsOf(shown))
    box.append(h('section', { 'aria-label': c.status }, h('h4', {}, h('span', { class: `status ${c.category}` }, c.status), h('span', { class: 'count' }, c.tickets.length)), h('ul', {}, c.tickets.map(card))))
  return box
}

function sprintView() {
  const title = state.sprint?.sprints?.length ? state.sprint.sprints.join(' · ') : T.sprint
  const board = state.layout === 'board'
  const redraw = () => {
    document.getElementById('list').replaceWith(board ? columns() : list())
    const tally = document.getElementById('tally')
    if (tally) tally.replaceWith(count())
  }
  const search = h('input', {
    placeholder: T.search,
    value: state.query,
    spellcheck: 'false',
    oninput: (e) => {
      state.query = e.target.value
      redraw()
    },
  })
  const chip = (label, pressed, onclick) => h('button', { class: 'chip', 'aria-pressed': String(pressed), onclick }, label)
  const sources = state.sources.length > 1 ? state.sources.map((s) => chip(s.key, state.source === `${s.account}:${s.key}`, () => ((state.source = state.source === `${s.account}:${s.key}` ? '' : `${s.account}:${s.key}`), render()))) : []
  const count = () => {
    const total = scope().length
    return h('span', { class: 'tally', id: 'tally' }, filtered() ? [`${T.shown(visible().length, total)} `, h('button', { class: 'reset', onclick: reset }, T.reset)] : T.count(total))
  }
  const layout = (value, label) => h('button', { 'aria-pressed': String(state.layout === value), onclick: () => ((state.layout = value), send('view', { view: value }), render()) }, label)
  return [
    bar(
      title,
      h('span', { class: 'segments', role: 'group', 'aria-label': T.view }, layout('list', T.list), layout('board', T.board)),
      h('button', { class: 'icon', title: T.refresh, 'aria-label': T.refresh, onclick: loadSprint }, h('span', { class: state.loading ? 'spin' : '' }, '↻')),
      h('button', { class: 'icon', title: T.settings, 'aria-label': T.settings, onclick: openSetup }, '⚙'),
    ),
    board
      ? h(
          'div',
          { class: 'split' },
          rail(),
          h('div', { class: 'main' }, h('div', { class: 'tools' }, search, chip(T.mine, state.f.mine, () => ((state.f.mine = !state.f.mine), render())), h('span', { class: 'spacer' }), count()), (state.sprint?.errors ?? []).map((e) => h('p', { class: 'bad pad' }, e)), columns()),
        )
      : [h('div', { class: 'tools' }, search, chip(T.mine, state.f.mine, () => ((state.f.mine = !state.f.mine), render())), ...sources), list()],
  ]
}

function keyLink(account, l, relation = '') {
  return h('button', { class: 'row', onclick: () => openTicket(account, l.key) }, relation && h('span', { class: 'relation' }, relation), h('span', { class: 'key' }, l.key), h('span', { class: 'title' }, l.title), l.status && h('span', { class: 'status' }, l.status))
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

function thread(t) {
  const roots = t.comments.filter((c) => !c.parent)
  const q = state.commentQuery.trim().toLowerCase()
  const inside = (c) => `${c.author}\n${c.body}`.toLowerCase().includes(q) || t.comments.some((r) => r.parent === c.id && inside(r))
  let shown = q ? roots.filter(inside) : roots
  if (state.newest) shown = [...shown].reverse()
  return h('div', { class: 'thread', id: 'thread' }, q && h('p', { class: 'faint' }, T.threads(shown.length, roots.length)), shown.map((c) => comment(t, c)))
}

function ticketView() {
  const t = state.ticket
  const back = h('button', { class: 'icon', title: T.back, 'aria-label': T.back, onclick: () => ((state.view = 'sprint'), (state.error = ''), (state.note = ''), render()) }, '←')
  if (t.loading || t.failed) return [h('div', { class: 'bar' }, back, h('h2', {}, t.key)), h('div', { class: 'body' }, state.error ? h('p', { class: 'bad' }, state.error) : h('p', { class: 'empty' }, T.loading))]
  const facts = [
    [T.status, h('span', { class: `status ${t.category}` }, t.status)],
    [T.assignee, t.assignee || T.unassigned],
    [T.priority, t.priority && [t.urgency > 0 && h('span', { class: `urgency u${t.urgency}` }, URGENCY[t.urgency]), ' ', t.priority]],
    [T.kind, t.kind],
    [T.parent, t.epic && `${t.epic.key} ${t.epic.title}`],
    [T.sprintField, t.sprint],
    [T.reporter, t.reporter],
    [T.labels, t.labels.join(', ')],
    [T.components, t.components.join(', ')],
    [T.versions, t.versions.join(', ')],
    ...t.custom.map((f) => [f.name, f.value]),
    [T.updated, (t.updated || '').slice(0, 10)],
  ].filter(([, v]) => v)
  const act = (kind) => {
    state.busy = kind
    state.note = kind === 'brief' ? T.briefing : ''
    state.error = ''
    send(kind, { account: t.account, key: t.key })
    render()
  }
  const launching = state.busy === `launch:${t.key}`
  const search = h('input', {
    type: 'search',
    placeholder: T.searchComments,
    value: state.commentQuery,
    oninput: (e) => {
      state.commentQuery = e.target.value
      document.getElementById('thread').replaceWith(thread(t))
    },
  })
  const sort = (newest, label) => h('button', { 'aria-pressed': String(state.newest === newest), onclick: () => ((state.newest = newest), render()) }, label)
  const main = h(
    'div',
    { class: 'main' },
    t.description && h('section', {}, h('h3', {}, T.description), rich(t.description)),
    t.attachments.length > 0 &&
      h(
        'section',
        {},
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
      ),
    h(
      'section',
      {},
      h('h3', {}, T.comments, h('small', {}, t.comments.length)),
      t.comments.length ? [h('div', { class: 'tools flat' }, search, h('span', { class: 'segments' }, sort(true, T.newest), sort(false, T.oldest))), thread(t)] : h('p', { class: 'faint' }, T.noComment),
    ),
  )
  const side = h(
    'aside',
    { class: 'side' },
    h('dl', { class: 'facts' }, facts.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
    t.subtasks.length > 0 && h('section', {}, h('h3', {}, T.subtasks, h('small', {}, t.subtasks.length)), t.subtasks.map((s) => keyLink(t.account, s))),
    t.links.length > 0 && h('section', {}, h('h3', {}, T.links, h('small', {}, t.links.length)), t.links.map((l) => keyLink(t.account, l, l.relation))),
  )
  return [
    h('div', { class: 'bar' }, back, h('h2', { class: 'mono' }, t.key)),
    h(
      'div',
      { class: 'body ticket' },
      h('div', { class: 'meta' }, h('span', { class: `kind ${tone(t.kind)}` }, (t.kind[0] || '?').toUpperCase()), t.kind, t.epic && h('span', { class: 'epic' }, t.epic.title)),
      h('h2', {}, t.title),
      h(
        'div',
        { class: 'actions' },
        h('button', { class: 'primary', disabled: !!state.busy, title: T.launchHint, onclick: () => launch(t) }, launching ? h('span', { class: 'spin' }, '↻') : null, launching ? ' ' : null, T.launch),
        h('button', { disabled: !!state.busy, onclick: () => act('insert') }, T.insert),
        h('button', { disabled: !!state.busy, title: T.briefHint, onclick: () => act('brief') }, state.busy === 'brief' ? h('span', { class: 'spin' }, '↻') : null, state.busy === 'brief' ? ' ' : null, T.brief),
      ),
      state.note && h('p', { class: 'note' }, state.note),
      !state.note && state.launched[t.key] && h('p', { class: 'note' }, T.launched(state.launched[t.key])),
      state.error && h('p', { class: 'bad' }, state.error),
      h('div', { class: 'whole' }, main, side),
    ),
  ]
}

function setupView() {
  const chosen = (account, key) => state.chosen.some((s) => s.account === account && s.key === key)
  const pick = (account, p) => {
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
          h('input', { type: 'checkbox', checked: chosen(a.id, p.key), onchange: () => pick(a.id, p) }),
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
  const focused = document.activeElement
  const at = focused?.tagName === 'INPUT' && focused.type !== 'checkbox' ? [...app.querySelectorAll('input')].indexOf(focused) : -1
  const views = { loading: () => [h('div', { class: 'body' }, h('p', { class: 'empty' }, T.loading))], noAccount, sprint: sprintView, ticket: ticketView, setup: setupView }
  app.className = state.view === 'sprint' && state.layout === 'board' ? 'is-board' : ''
  app.replaceChildren(...views[state.view]().flat(Infinity).filter(Boolean))
  if (at >= 0) {
    const input = app.querySelectorAll('input')[at]
    if (input && state.view !== 'setup') {
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }
}

addEventListener('keydown', (e) => {
  if (e.key !== '/' || e.target.closest('input, textarea') || state.view !== 'sprint') return
  e.preventDefault()
  document.querySelector('.tools input')?.focus()
})

render()
send('ready')
