import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNoteMap, wikilinkPlugin } from './wikilinks.mjs'
import { buildExcludes } from './publish-scope.mjs'
import { mermaidPlugin } from './mermaid.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../../vault')
const sidebar = JSON.parse(fs.readFileSync(path.join(here, 'sidebar.json'), 'utf8'))
const srcExclude = buildExcludes(vaultRoot, fs)

export default defineConfig({
  title: 'QMS_controls',
  description: 'Controlled documents from the QMS vault — the counterpart to QMS_demo',
  base: '/qms-controls/',
  srcDir: '../vault',
  head: [
    ['script', {}, "try{if(localStorage.getItem('qms-sidebar-hidden')==='1')document.documentElement.classList.add('hide-sidebar')}catch(e){}"],
  ],
  // Everything except guides/ is published here. The opposite site holds the
  // guides; each repo owns its own copy of the configuration.
  srcExclude,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Policies', link: '/policies/POL-QUAL-001' },
      { text: 'Procedures', link: '/procedures/SOP-QA-001' },
      { text: 'Records', link: '/records/TRAIN-REC-2026-07' },
      { text: 'Audits', link: '/audits/AUDIT-2026-Q1' },
      { text: 'CAPA', link: '/capa/CAPA-2026-001' },
      { text: 'Registers', link: '/registers/document-master.sheet' },
      { text: 'ISO 9001', link: '/iso-9001/iso-9001-map' },
    ],
    sidebar,
    search: { provider: 'local' },
    outline: [2, 3],
    editLink: false,
    lastUpdated: false,
  },

  markdown: {
    config: (md) => {
      md.use(wikilinkPlugin(buildNoteMap(vaultRoot)))
      md.use(mermaidPlugin)
    },
  },

  // No vue alias here: node_modules at the vault root is a symlink to
  // site/node_modules (created by docs:prepare), so imports from notes resolve
  // to ONE Vue instance. Aliasing 'vue' broke hydration in the first build.
})
