// Generates a sidebar with the same shape as QMS_demo: one group, chapters
// that are big, collapsible, and nested documents underneath. Controlled
// documents have no numeric prefixes, so folders play the role of chapters
// and subfolders (ISO 9001: 2015 / 2026) play the role of sections.

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

const byFolder = new Map()
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
    const item = { text: titleOf(full), link: '/' + rel.slice(0, -3) }
    const slash = rel.indexOf('/')
    if (slash === -1) {
      if (entry.name !== 'index.md') rootDocs.push(item)
      continue
    }
    const folder = rel.slice(0, slash)
    if (!PUBLISHED_FOLDERS.includes(folder)) continue
    if (!byFolder.has(folder)) byFolder.set(folder, [])
    byFolder.get(folder).push({ ...item, rel: rel.slice(folder.length + 1) })
  }
}

walk(vaultRoot)

function chapter(text, items) {
  return {
    text,
    collapsed: true,
    items: items.sort((a, b) => a.text.localeCompare(b.text)).map(({ text, link }) => ({ text, link })),
  }
}

const chapters = []

if (rootDocs.length) {
  chapters.push(chapter('Vault docs', rootDocs))
}

for (const folder of PUBLISHED_FOLDERS) {
  const pages = byFolder.get(folder)
  if (!pages || !pages.length) continue

  // ISO 9001 has 2015/2026 subfolders — nest them as sections.
  const subfolders = new Map()
  const flat = []
  for (const page of pages) {
    const slash = page.rel.indexOf('/')
    if (slash === -1) {
      flat.push(page)
    } else {
      const sub = page.rel.slice(0, slash)
      if (!subfolders.has(sub)) subfolders.set(sub, [])
      subfolders.get(sub).push(page)
    }
  }

  const items = flat.sort((a, b) => a.text.localeCompare(b.text)).map(({ text, link }) => ({ text, link }))
  for (const [sub, notes] of [...subfolders.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    items.push({
      text: sub === '2015' ? 'ISO 9001:2015 (legacy)' : 'ISO 9001:2026',
      collapsed: true,
      items: notes.sort((a, b) => a.text.localeCompare(b.text)).map(({ text, link }) => ({ text, link })),
    })
  }
  chapters.push({
    text: TITLES[folder] || folder,
    collapsed: true,
    items,
  })
}

const sidebar = [{ text: 'QMS controls', collapsed: false, items: chapters }]
fs.writeFileSync(path.join(here, 'sidebar.json'), JSON.stringify({ '/': sidebar }, null, 2) + '\n')

const count = (items) => items.reduce((n, i) => n + 1 + (i.items ? count(i.items) : 0), 0)
console.log(`sidebar.json: ${sidebar.length} group, ${chapters.length} chapters, ${count(chapters)} pages`)
