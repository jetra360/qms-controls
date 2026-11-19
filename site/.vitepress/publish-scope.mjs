// Single source of truth for what QMS_controls publishes.
// This is the counterpart of QMS_demo: it holds every note the guide site
// does not. Both sites keep their own copy of this module, so they evolve
// independently.

export const PUBLISHED_FOLDERS = [
  'policies',
  'procedures',
  'instructions',
  'records',
  'audits',
  'capa',
  'registers',
  'iso-9001',
  'templates',
  'dashboards',
  'people',
  'roles',
  'inbox',
  'types',
  'views',
]

export const PUBLISHED_ROOT_FILES = [
  'index.md',
  'README.md',
  'AGENTS.md',
  'lessons-learned.md',
  'DEVELOPMENT.md',
]

// The companion site. Links to its notes become absolute URLs, not dead ends.
export const REMOTE_BASE = 'https://jetra360.github.io/qms-demo'

/**
 * Given a path relative to the vault root (using either separator), is it
 * part of the published site?
 */
export function isPublished(rel) {
  const normalized = rel.split('\\').join('/')
  if (!normalized.endsWith('.md')) return false
  const slash = normalized.indexOf('/')
  if (slash === -1) return PUBLISHED_ROOT_FILES.includes(normalized)
  const top = normalized.slice(0, slash)
  return PUBLISHED_FOLDERS.includes(top)
}

/**
 * Glob patterns for VitePress `srcExclude`, derived from the folders that
 * actually exist. Anything not published is excluded from the build.
 */
export function buildExcludes(vaultRoot, fs) {
  const excludes = []
  for (const entry of fs.readdirSync(vaultRoot, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    if (entry.isDirectory()) {
      if (entry.name === 'site' || entry.name === 'node_modules') continue
      if (!PUBLISHED_FOLDERS.includes(entry.name)) excludes.push(entry.name + '/**')
    } else if (entry.name.endsWith('.md')) {
      if (!PUBLISHED_ROOT_FILES.includes(entry.name)) excludes.push(entry.name)
    }
  }
  return excludes
}
