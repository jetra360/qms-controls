---
type: Note
status: active
_organized: true
tags:
  - qms
  - start-here
---
# QMS_controls vault — start here

The controlled-document counterpart to **QMS_demo**. This repository holds every vault note that the guide site does not publish, and its website publishes that same set. The two repositories, configurations, workflows and deployments are independent.

## What lives here

| Folder | Content |
|---|---|
| `policies/` | Quality policies |
| `procedures/` | SOPs |
| `instructions/` | Work instructions |
| `records/` | Training and inspection records |
| `audits/` | Internal audits and AuditFindings |
| `capa/` | Corrective and preventive actions |
| `registers/` | Master document register, RACI, risk register |
| `iso-9001/` | 2026 top-level clauses and cited 2015 clauses |
| `templates/` | Copy-paste forms and AI drafting prompts |
| `dashboards/` | Lifecycle diagrams |
| `people/`, `roles/` | Owners and responsibilities |
| `inbox/` | Untyped captures awaiting triage |
| `types/` | Tolaria Type documents |
| `views/` | Saved views (`.yml`, not rendered on the site) |

The guides live only in the separate `qms-demo` repository.

## Open it

1. In Tolaria: **Add vault → Open existing folder** → select `qms-controls/vault/`. The website code (`site/`, `scripts/`, `.github/`) stays outside the vault, so it never appears in Tolaria's Inbox.
2. Use the **Views** panel for document control: *Controlled documents*, *Open CAPAs*, *Overdue / under review*, *Unapproved drafts*, *Inbox triage queue*.
3. Open [[index|the site homepage]] or [[lessons-learned|the build notes]].

## Website

```text
site/package.json               ← vitepress + docs:dev / docs:build
site/.vitepress/config.mts      ← title QMS_controls, base '/qms-controls/', nav
site/.vitepress/publish-scope.mjs ← THE publish allowlist + REMOTE_BASE
site/.vitepress/wikilinks.mjs   ← local links + cross-site absolute links
site/.vitepress/build-sidebar.mjs ← folders as collapsible chapters
site/.vitepress/mermaid.mjs     ← mermaid fences → renderable containers
site/.vitepress/remote-manifest.json ← guide stems from the other site
site/.vitepress/theme/          ← Nord styling, diagram overlays, sidebar controls
site/.vitepress/sidebar.json    ← generated (do not hand-edit)
.github/workflows/deploy.yml    ← GitHub Actions → GitHub Pages
scripts/validate-vault.py       ← document-control validator
scripts/validate-wikilinks.py   ← frontmatter/view/wikilink checker
```

Local preview and build:

```sh
cd qms-controls/site
npm install          # once
npm run docs:dev
npm run docs:build   # output: site/.vitepress/dist/
```

`docs:prepare` recreates the `node_modules` symlink inside `vault/` and regenerates the sidebar. Never commit `dist/`, `node_modules/` or the generated symlink.

## Two independent sites

| | QMS_demo | QMS_controls |
|---|---|---|
| Repo | `jetra360/qms-demo` | `jetra360/qms-controls` |
| URL | `jetra360.github.io/qms-demo` | `jetra360.github.io/qms-controls` |
| Content | `guides/` | everything else |
| Sidebar | numeric chapters (01, 01.2) | folder chapters (Policies, Records, …) with the same nested styling |

A link to a note on the other site resolves through `site/.vitepress/remote-manifest.json` into an absolute URL and opens in a new tab. If you add or rename a note, regenerate the opposite manifest and commit it in **both** repos — see [[lessons-learned]].

## Further reading

- [[AGENTS]] — authoring and safety rules
- [[lessons-learned]] — decisions, pitfalls and cross-site setup
- [[DEVELOPMENT]] — developer guide for the build and deploy pipeline
