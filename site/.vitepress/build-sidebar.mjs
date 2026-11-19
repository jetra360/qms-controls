// Generates a flat, folder-based sidebar from the published subset.
// Unlike QMS_demo, these notes have no numeric chapter hierarchy — the
// controlled documents are grouped by their folder (Policies, Records, ...).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PUBLISHED_FOLDERS, isPublished } from './publish-scope.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../../vault')

const TITLES = {
  policies: 'Policies',
  procedures: 'Procedures',
  instructions: 'Work instructions',
  records: 'Records',
  audits: 'Audits & findings',
  capa: 'CAPA',
  registers: 'Registers',
  'iso-9001': 'ISO 9001',
  templates: 'Templates',
  dashboards: 'Dashboards',
  people: 'People',
  roles: 'Roles',
  inbox: 'Inbox captures',
  types: 'Types',
  views: 'Saved views',
}

function titleOf(file) {
  const text = fs.readFileSync(file, 'utf8')
  const h1 = /^# (.+)$/m.exec(text)
  return h1 ? h1[1].trim() : path.basename(file, '.md')
}

const groups = new Map()
const rootDocs = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'site' || entry.name === 'node_modules') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const rel = path.relative(vaultRoot, full).split(path.sep).join('/')
    if (!isPublished(rel)) continue
    const link = '/' + rel.slice(0, -3)
    const item = { text: titleOf(full), link }
    const slash = rel.indexOf('/')
    if (slash === -1) {
      if (entry.name !== 'index.md') rootDocs.push(item)
      continue
    }
    const folder = rel.slice(0, slash)
    if (!PUBLISHED_FOLDERS.includes(folder)) continue
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push(item)
  }
}

walk(vaultRoot)

const sidebar = PUBLISHED_FOLDERS
  .filter((folder) => groups.has(folder))
  .map((folder) => ({
    text: TITLES[folder] || folder,
    collapsed: true,
    items: groups.get(folder).sort((a, b) => a.text.localeCompare(b.text)),
  }))

if (rootDocs.length) {
  sidebar.unshift({
    text: 'Vault docs',
    collapsed: true,
    items: rootDocs.sort((a, b) => a.text.localeCompare(b.text)),
  })
}

fs.writeFileSync(path.join(here, 'sidebar.json'), JSON.stringify({ '/': sidebar }, null, 2) + '\n')
const total = sidebar.reduce((n, g) => n + g.items.length, 0)
console.log(`sidebar.json: ${sidebar.length} groups, ${total} pages`)
