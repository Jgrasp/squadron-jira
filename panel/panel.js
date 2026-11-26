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
      agent: 'Agent',
      agentHint: 'Lancer un nouvel agent ou reprendre un agent de ce ticket',
      launchNew: 'Lancer un nouvel agent',
      resumeHead: 'Reprendre un agent',
      states: { working: 'En cours', waiting: 'Vous attend', done: 'Terminé', interrupted: 'Interrompu', error: 'En erreur' },
      archived: 'Archivé',
      waitingFor: { permission: 'demande une autorisation', question: 'pose une question' },
      running: (tool) => `utilise ${tool}`,
      errors: { crash: 'son processus s’est arrêté', api: 'refusé par l’API de Claude', mcp: 'un serveur MCP a échoué' },
      forTime: (d) => `depuis ${d}`,
      branch: 'Branche',
      launchedAt: 'Lancé',
      showHint: 'Cliquez pour l’afficher',
      archiveHint: 'Cliquez pour l’ouvrir en lecture seule, dans l’archive',
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
      noAccess: 'pas d’accès',
      cannotSee: (name) => ['Votre compte Jira ne voit pas ', name, '.'],
      details: 'Détails',
      deniedTitle: (name) => `Pas d’accès à ${name}`,
      deniedText: 'Votre compte Jira ne peut pas parcourir ce projet. Demandez à un administrateur Jira de vous y ajouter, ou liez-le avec un autre compte.',
      filters: 'Filtres',
      columns: 'Colonnes',
      hideFilters: 'Masquer les filtres',
      showFilters: 'Afficher les filtres',
      jiraOrder: 'Ordre de Jira',
      dragColumn: 'Glissez pour déplacer la colonne',
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
      agent: 'Agent',
      agentHint: 'Launch a new agent or resume an agent of this ticket',
      launchNew: 'Launch a new agent',
      resumeHead: 'Resume an agent',
      states: { working: 'Working', waiting: 'Waiting for you', done: 'Done', interrupted: 'Interrupted', error: 'Error' },
      archived: 'Archived',
      waitingFor: { permission: 'asks for a permission', question: 'asks a question' },
      running: (tool) => `running ${tool}`,
      errors: { crash: 'its process stopped', api: 'refused by Claude’s API', mcp: 'an MCP server failed' },
      forTime: (d) => `for ${d}`,
      branch: 'Branch',
      launchedAt: 'Launched',
      showHint: 'Click to show it',
      archiveHint: 'Click to open it read only, in the archive',
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
      noAccess: 'no access',
      cannotSee: (name) => ['Your Jira account cannot see ', name, '.'],
      details: 'Details',
      deniedTitle: (name) => `No access to ${name}`,
      deniedText: 'Your Jira account cannot browse this project. Ask a Jira admin to add you to it, or link it with another account.',
      filters: 'Filters',
      columns: 'Columns',
      hideFilters: 'Hide the filters',
      showFilters: 'Show the filters',
      jiraOrder: 'Jira order',
      dragColumn: 'Drag to move the column',
    }

const emptyFilters = () => ({ mine: false, people: [], hidden: { status: [], kind: [], priority: [], epic: [] } })

const state = {
  view: 'loading',
  layout: 'list',
  rail: true,
  order: [],
  project: '',
  accounts: [],
  sources: [],
  launched: {},
  menu: '',
  menuFor: null,
  peek: '',
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

let kept = ''
const snapshot = () => JSON.stringify({ source: state.source, f: state.f })
function keep() {
  const now = snapshot()
  if (!state.project || now === kept) return
  kept = now
  send('filters', { filters: JSON.parse(now) })
}

function restore(saved = {}) {
  const empty = emptyFilters()
  const f = saved.f || {}
  const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [])
  state.source = state.sources.some((s) => `${s.account}:${s.key}` === saved.source) ? saved.source : ''
  state.f = { mine: f.mine === true, people: list(f.people), hidden: Object.fromEntries(Object.keys(empty.hidden).map((k) => [k, list(f.hidden?.[k])])) }
  kept = snapshot()
}

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

const columnOf = (t) => t.column || t.status

function rank(g) {
  const custom = state.order.indexOf(g.status)
  if (custom >= 0) return custom
  const jira = (state.sprint?.columns ?? []).indexOf(g.status)
  if (jira >= 0) return 1000 + jira
  return 2000 + (RANK[g.category] ?? 1)
}

function columnsOf(list) {
  const groups = []
  for (const t of list) {
    const g = groups.find((g) => g.status === columnOf(t))
    if (g) g.tickets.push(t)
    else groups.push({ status: columnOf(t), category: t.category, tickets: [t] })
  }
  return groups.sort((a, b) => rank(a) - rank(b))
}

function move(name, before) {
  const names = columnsOf(state.sprint?.tickets ?? []).map((g) => g.status)
  const next = names.filter((n) => n !== name)
  const at = before === null ? next.length : next.indexOf(before)
  next.splice(at < 0 ? next.length : at, 0, name)
  if (next.join('\n') === names.join('\n')) return
  state.order = next
  send('order', { order: next })
  render()
}

function drag(event, name) {
  if (event.button !== 0) return
  const box = event.currentTarget.closest('.columns')
  const sections = [...box.querySelectorAll(':scope > section')]
  const from = event.currentTarget.closest('section')
  const start = event.clientX
  let target = undefined
  const mark = (x) => {
    sections.forEach((s) => s.classList.remove('drop-before', 'drop-after'))
    const after = sections.find((s) => {
      const r = s.getBoundingClientRect()
      return x < r.left + r.width / 2
    })
    target = after ? after.getAttribute('aria-label') : null
    if (after) after.classList.add('drop-before')
    else sections.at(-1)?.classList.add('drop-after')
  }
  const moveHandler = (e) => {
    if (Math.abs(e.clientX - start) < 6 && target === undefined) return
    from.classList.add('dragging')
    mark(e.clientX)
  }
  const up = () => {
    removeEventListener('pointermove', moveHandler)
    removeEventListener('pointerup', up)
    from.classList.remove('dragging')
    sections.forEach((s) => s.classList.remove('drop-before', 'drop-after'))
    if (target !== undefined && target !== name) move(name, target)
  }
  addEventListener('pointermove', moveHandler)
  addEventListener('pointerup', up)
}

function loadSprint() {
  state.loading = true
  state.error = ''
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
  state.menu = ''
  state.peek = ''
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
      state.rail = msg.rail !== false
      state.order = msg.order || []
      state.projects = {}
      restore(msg.filters)
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
      state.launched = msg.launched || state.launched
      if (state.view === 'ticket' && state.ticket?.key === msg.key) state.note = T.launched(msg.agent)
      break
    case 'agents':
      state.launched = msg.launched || {}
      break
    case 'resumed':
      return
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
      state.error = msg.for === 'sprint' ? '' : msg.message
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

const sourceId = (s) => `${s.account}:${s.key}`
const sourceName = (s) => `${s.key} · ${s.name || s.key}`
const isDenied = (s) => (state.sprint?.denied ?? []).includes(sourceId(s))
const blocked = () => state.sources.filter((s) => isDenied(s) && (!state.source || state.source === sourceId(s)))

function notices(pad) {
  if (!scope().length) return []
  return blocked().map((s) =>
    h('div', { class: `notice${pad ? ' pad' : ''}` }, h('span', { class: 'mark', 'aria-hidden': 'true' }), h('span', {}, T.cannotSee(h('b', {}, sourceName(s)))), h('button', { class: 'reset', onclick: () => ((state.source = sourceId(s)), (state.f = emptyFilters()), render()) }, T.details)),
  )
}

function deniedCards() {
  if (scope().length) return []
  return blocked().map((s) => h('div', { class: 'denied' }, h('h4', {}, T.deniedTitle(sourceName(s))), h('p', {}, T.deniedText), h('button', { class: 'primary', onclick: openSetup }, T.settings)))
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
      !f.hidden.status.includes(columnOf(t)) &&
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
  if (state.error) box.append(h('p', { class: 'bad' }, state.error))
  const cards = deniedCards()
  if (cards.length) return box.append(...cards), box
  box.append(...notices())
  const shown = visible()
  if (!shown.length) box.append(h('p', { class: 'empty' }, state.sprint?.tickets.length ? T.noMatch : T.noSprint))
  for (const g of columnsOf(shown)) box.append(h('h3', {}, g.status, h('small', {}, g.tickets.length)), ...g.tickets.map(ticketRow))
  return box
}

function spark() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '13')
  svg.setAttribute('height', '13')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = '<path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/>'
  return svg
}

const lang = fr ? 'fr' : 'en'
const UNITS = [
  ['day', 86400000],
  ['hour', 3600000],
  ['minute', 60000],
]

function span(ms) {
  const [unit, size] = UNITS.find(([, size]) => ms >= size) || UNITS.at(-1)
  return new Intl.NumberFormat(lang, { style: 'unit', unit, unitDisplay: 'short' }).format(Math.max(1, Math.floor(ms / size)))
}

function ago(at) {
  const ms = Date.now() - at
  const [unit, size] = UNITS.find(([, size]) => ms >= size) || ['second', 1000]
  return new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(-Math.floor(ms / size), unit)
}

const agentsOf = (key) => state.launched[key] || []
const stateOf = (a) => (a.archived ? 'archived' : a.status)
const labelOf = (a) => (a.archived ? T.archived : T.states[a.status] || a.status)
const detailOf = (a) => (a.archived ? '' : a.status === 'waiting' ? T.waitingFor[a.waiting] : a.status === 'working' && a.tool ? T.running(a.tool) : a.status === 'error' ? T.errors[a.error] : '') || ''
const dot = (a) => h('span', { class: `adot ${stateOf(a)}` })

function chevron() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '12')
  svg.setAttribute('height', '12')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('class', 'chevron')
  svg.innerHTML = '<path d="M6 9l6 6 6-6"/>'
  return svg
}

function agentButton(t, where) {
  const busy = state.busy === `launch:${t.key}`
  const agents = agentsOf(t.key)
  const primary = where === 'ticket'
  const spin = busy && h('span', { class: 'spin' }, '↻')
  if (!agents.length) return primary ? h('button', { class: 'primary', disabled: !!state.busy, title: T.launchHint, onclick: () => launch(t) }, spin, busy ? ' ' : null, T.launch) : h('button', { class: 'action', disabled: !!state.busy, title: T.launchHint, onclick: () => launch(t) }, spin || spark(), T.launch)
  const id = `${where}:${t.account}:${t.key}`
  const open = (e) => {
    e.stopPropagation()
    state.peek = ''
    state.menu = state.menu === id ? '' : id
    state.menuFor = t
    if (state.menu) send('agents')
    floating()
  }
  return h('button', { class: `agentbtn ${primary ? 'primary' : 'action'}`, 'data-menu': id, 'aria-haspopup': 'menu', 'aria-expanded': String(state.menu === id), disabled: !!state.busy, title: T.agentHint, onclick: open }, spin || dot(agents[0]), T.agent, h('span', { class: 'n' }, agents.length), chevron())
}

function resume(a) {
  state.menu = ''
  state.peek = ''
  state.error = ''
  send('resume', { agent: a.id })
  floating()
}

const layer = document.body.appendChild(h('div', { id: 'layer' }))
const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi))

function floating() {
  document.querySelectorAll('[data-menu]').forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.menu === state.menu)))
  const anchor = state.menu && [...document.querySelectorAll('[data-menu]')].find((b) => b.dataset.menu === state.menu)
  const t = state.menuFor
  if (!anchor || !t || !agentsOf(t.key).length) {
    state.menu = ''
    state.peek = ''
    return layer.replaceChildren()
  }
  const agents = agentsOf(t.key)
  const menu = h(
    'div',
    { class: 'amenu', role: 'menu' },
    h('button', { class: 'aitem', role: 'menuitem', onclick: () => launch(t) }, spark(), T.launchNew),
    h('div', { class: 'asep' }),
    h('div', { class: 'ahead' }, T.resumeHead),
    agents.map((a) =>
      h(
        'button',
        { class: `aitem${a.archived ? ' old' : ''}`, role: 'menuitem', 'data-id': a.id, onmouseenter: (e) => peek(e.currentTarget, a), onmouseleave: unpeek, onfocus: (e) => peek(e.currentTarget, a), onblur: unpeek, onclick: () => resume(a) },
        dot(a),
        h('span', { class: 'what' }, h('span', { class: 'aname' }, a.name), h('small', {}, [labelOf(a), a.at ? ago(a.at) : ''].filter(Boolean).join(' · '))),
      ),
    ),
  )
  layer.replaceChildren(menu)
  const r = anchor.getBoundingClientRect()
  const m = menu.getBoundingClientRect()
  menu.style.left = `${clamp(r.left, 8, innerWidth - m.width - 8)}px`
  menu.style.top = `${r.bottom + 4 + m.height > innerHeight - 8 && r.top - 4 - m.height >= 8 ? r.top - 4 - m.height : r.bottom + 4}px`
  const hovered = state.peek && menu.querySelector(`[data-id="${CSS.escape(state.peek)}"]`)
  if (hovered) peek(hovered, agents.find((a) => a.id === state.peek))
}

function peek(item, a) {
  if (!a) return
  state.peek = a.id
  layer.querySelectorAll('.aitem.hot').forEach((x) => x.classList.remove('hot'))
  item.classList.add('hot')
  const facts = [a.branch && [T.branch, h('span', { class: 'mono' }, a.branch)], a.at && [T.launchedAt, ago(a.at)]].filter(Boolean)
  const box = h(
    'div',
    { class: 'apeek' },
    h('p', { class: 'ptitle' }, a.name),
    h('div', { class: 'pstate' }, dot(a), labelOf(a), h('small', {}, [detailOf(a), a.since && T.forTime(span(Date.now() - a.since))].filter(Boolean).join(' · '))),
    facts.length > 0 && h('dl', { class: 'facts' }, facts.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
    h('p', { class: 'phint' }, a.archived ? T.archiveHint : T.showHint),
  )
  layer.querySelector('.apeek')?.remove()
  layer.append(box)
  const m = layer.querySelector('.amenu').getBoundingClientRect()
  const r = item.getBoundingClientRect()
  const b = box.getBoundingClientRect()
  let left = m.right + 6
  let top = clamp(r.top - 4, 8, innerHeight - b.height - 8)
  if (left + b.width > innerWidth - 8) left = m.left - 6 - b.width
  if (left < 8) {
    left = clamp(m.left, 8, innerWidth - b.width - 8)
    top = m.bottom + 6 + b.height <= innerHeight - 8 ? m.bottom + 6 : Math.max(8, m.top - 6 - b.height)
  }
  box.style.left = `${left}px`
  box.style.top = `${top}px`
}

function unpeek() {
  state.peek = ''
  layer.querySelectorAll('.aitem.hot').forEach((x) => x.classList.remove('hot'))
  layer.querySelector('.apeek')?.remove()
}

function closeMenu() {
  if (!state.menu) return
  state.menu = ''
  floating()
}

addEventListener('click', (e) => {
  if (!e.target.closest('#layer')) closeMenu()
})
addEventListener('scroll', (e) => e.target.closest?.('#layer') || closeMenu(), true)
addEventListener('resize', closeMenu)

function card(t) {
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
      agentButton(t, 'card'),
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
            h('span', { class: isDenied(s) ? 'label muted' : 'label' }, s.name || s.key),
            h('span', { class: 'tag' }, s.key),
            isDenied(s) ? h('span', { class: 'badge bad-tone' }, T.noAccess) : h('small', {}, all.filter((t) => inSource(t, s)).length),
          ),
        ),
      ),
    section(T.show, check(f.mine, (e) => ((f.mine = e.target.checked), render()), T.mineOnly, h('small', {}, tally((t) => t.mine)))),
    section(
      T.columns,
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
  const cards = deniedCards()
  if (cards.length) return (box.className = 'nothing'), box.append(...cards), box
  const shown = visible()
  if (!shown.length) {
    box.className = 'nothing'
    box.append(h('p', { class: 'empty' }, state.sprint?.tickets.length ? T.noMatch : T.noSprint), filtered() ? h('button', { onclick: reset }, T.reset) : '')
    return box
  }
  for (const c of columnsOf(shown))
    box.append(
      h(
        'section',
        { 'aria-label': c.status },
        h('h4', { title: T.dragColumn, onpointerdown: (e) => drag(e, c.status) }, h('span', { class: `status ${c.category}` }, c.status), h('span', { class: 'count' }, c.tickets.length)),
        h('ul', {}, c.tickets.map(card)),
      ),
    )
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
          state.rail && rail(),
          h(
            'div',
            { class: 'main' },
            h(
              'div',
              { class: 'tools' },
              h(
                'button',
                { class: 'icon rail-toggle', title: state.rail ? T.hideFilters : T.showFilters, 'aria-label': state.rail ? T.hideFilters : T.showFilters, 'aria-pressed': String(state.rail), onclick: () => ((state.rail = !state.rail), send('rail', { on: state.rail }), render()) },
                h('span', { class: 'panes', 'aria-hidden': 'true' }),
                !state.rail && filtered() && h('span', { class: 'dot', 'aria-hidden': 'true' }),
              ),
              search,
              chip(T.mine, state.f.mine, () => ((state.f.mine = !state.f.mine), render())),
              h('span', { class: 'spacer' }),
              state.order.length > 0 && h('button', { class: 'reset', onclick: () => ((state.order = []), send('order', { order: [] }), render()) }, T.jiraOrder),
              count(),
            ),
            (state.sprint?.errors ?? []).map((e) => h('p', { class: 'bad pad' }, e)),
            state.error && h('p', { class: 'bad pad' }, state.error),
            notices(true),
            columns(),
          ),
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
        agentButton(t, 'ticket'),
        h('button', { disabled: !!state.busy, onclick: () => act('insert') }, T.insert),
        h('button', { disabled: !!state.busy, title: T.briefHint, onclick: () => act('brief') }, state.busy === 'brief' ? h('span', { class: 'spin' }, '↻') : null, state.busy === 'brief' ? ' ' : null, T.brief),
      ),
      state.note && h('p', { class: 'note' }, state.note),
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
  keep()
  const app = document.getElementById('app')
  const focused = document.activeElement
  const at = focused?.tagName === 'INPUT' && focused.type !== 'checkbox' ? [...app.querySelectorAll('input')].indexOf(focused) : -1
  const views = { loading: () => [h('div', { class: 'body' }, h('p', { class: 'empty' }, T.loading))], noAccount, sprint: sprintView, ticket: ticketView, setup: setupView }
  app.className = state.view === 'sprint' && state.layout === 'board' ? 'is-board' : ''
  app.replaceChildren(...views[state.view]().flat(Infinity).filter(Boolean))
  floating()
  if (at >= 0) {
    const input = app.querySelectorAll('input')[at]
    if (input && state.view !== 'setup') {
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }
}

addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu()
  if (e.key !== '/' || e.target.closest('input, textarea') || state.view !== 'sprint') return
  e.preventDefault()
  document.querySelector('.tools input')?.focus()
})

render()
send('ready')
