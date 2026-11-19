---
type: Note
status: active
_organized: true
tags:
  - reference
  - lessons-learned
  - build
description: "Decisions and pitfalls from splitting the QMS vault into two independent sites"
---
# Lessons learned — QMS_controls

The full build history (Tolaria boundaries, frontmatter contract, VitePress/Vue hydration trap, Nord palette, Mermaid newline problem) is recorded in `lessons-learned.md` of the **QMS_demo** repository. This note covers only what was new when the vault was split into two sites.

## 1. Why two sites

The first site published only `guides/`, but its public repository still contained every note. To make the two halves independent, the non-guide folders were moved into this repository and the `qms-demo` repository was trimmed to its own scope.

- Each repo has its own `site/`, `.github/workflows/deploy.yml`, `package-lock.json`, docs and Git history.
- Configuration is **copied**, not shared. A change to one site never rebuilds the other.
- `base` must match the repo name: `/qms-demo/` vs `/qms-controls/`.

## 2. Cross-site links need a manifest

A repo cannot resolve a link to a note it no longer contains. Each site therefore commits `site/.vitepress/remote-manifest.json`, a `stem → route` map of the *other* site's pages.

- `wikilinks.mjs` checks the local published map first, then the remote manifest.
- A remote hit becomes an absolute URL (`https://jetra360.github.io/qms-demo/...`) with `target="_blank"` and a small "↗" marker.
- Unknown targets keep the dimmed "(not published)" span.
- **Maintenance rule:** adding, renaming or deleting a note requires refreshing the opposite manifest in both repos. `scripts/validate-wikilinks.py` consults the manifest, so cross-site links are not reported as broken.

## 3. Sidebar shape follows the content

QMS_demo's numbers (`01 → 01.2 → 01.2.1`) encode a chapter tree. Controlled documents have no such numbering, so `build-sidebar.mjs` here produces flat folder groups with friendly titles. `ChapterBanner.vue` and `ChapterNav.vue` were deliberately not copied — they would be inert without numeric prefixes. `MermaidMount.vue` still saves the last visited page, and `ContinueReading.vue` shows the resume link on this site's homepage.

## 4. Independence checklist

1. Never import code from the other repo.
2. Keep `REMOTE_BASE` in `publish-scope.mjs` pointed at the other site's real URL.
3. Keep both remote manifests in sync after renames.
4. Verify both workflows after a change; a green build here says nothing about the other site.
5. `scripts/validate-vault.py` and `scripts/validate-wikilinks.py` run locally in each repo.

## 5. Safety reminder

The QMS_demo repository's Git history still contains the control-side notes from before the split. Removing files from `HEAD` is not the same as removing them from history. A history rewrite is destructive and requires explicit approval before it is attempted.
