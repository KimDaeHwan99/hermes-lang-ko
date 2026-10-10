#!/usr/bin/env node
// Build locales/ko.desktop.yaml from the Korean Desktop catalog in a Hermes source tree.
// Usage: node tools/convert.mjs --src <hermes checkout with ko.ts> --keys <_keys.desktop.json> --esbuild-root <dir with node_modules>
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { execFileSync } from 'node:child_process'

const { values: a } = parseArgs({ options: {
  src: { type: 'string' }, keys: { type: 'string' }, 'esbuild-root': { type: 'string' },
  out: { type: 'string', default: 'locales/ko.desktop.yaml' } } })
const src = resolve(a.src), root = resolve(a['esbuild-root'])
const { build } = await import(pathToFileURL(join(root, 'node_modules/esbuild/lib/main.js')).href)
const app = join(src, 'apps/desktop')
const alias = {
  '@hermes/shared/ansi': join(src, 'apps/shared/src/ansi.ts'),
  '@hermes/shared/billing': join(src, 'apps/shared/src/billing-types.ts'),
  '@hermes/shared/color': join(src, 'apps/shared/src/color.ts'),
  '@hermes/shared/i18n': join(src, 'apps/shared/src/i18n.ts'),
  '@hermes/shared/translucency': join(src, 'apps/shared/src/translucency.ts'),
  '@hermes/shared': join(src, 'apps/shared/src/index.ts'),
  '@': join(app, 'src'),
}
async function load(name, exportName) {
  const outfile = join(resolve('build'), `${name}-${process.pid}.mjs`)
  mkdirSync(resolve('build'), { recursive: true })
  await build({ entryPoints: [join(app, `src/i18n/${name}.ts`)], bundle: true, format: 'esm', platform: 'node',
    target: 'node22', jsx: 'automatic', alias, nodePaths: [join(root, 'node_modules')],
    loader: { '.css': 'empty', '.svg': 'empty', '.png': 'empty', '.woff2': 'empty' }, logLevel: 'error', outfile })
  try { return (await import(pathToFileURL(outfile).href))[exportName] } finally { rmSync(outfile, { force: true }) }
}
const isRec = v => typeof v === 'object' && v !== null && !Array.isArray(v)
function flat(t, p = '', o = {}) {
  for (const [k, v] of Object.entries(t)) { const path = p ? `${p}.${k}` : k; isRec(v) ? flat(v, path, o) : (o[path] = v) }
  return o
}
// Function entries become positional "{0}/{1}" strings, the form Desktop language packs expect.
// That is only faithful when the function interpolates its arguments. A function that branches on
// an argument (on/off, show/hide, plurals, optional parts) cannot be expressed as one positional
// string, so it is excluded and falls back to English rather than being pinned to one branch.
const NUMERIC = [0, 1, 2, 7]
const SEMANTIC = [true, false, null, undefined, '', 'x']
function call(fn, args) {
  try { const out = fn(...args); return typeof out === 'string' ? out : undefined } catch { return undefined }
}
function render(v, probes = [...NUMERIC, ...SEMANTIC]) {
  if (typeof v === 'string') return { text: v }
  if (typeof v !== 'function') return { skip: `non-text ${typeof v}` }
  const ph = Array.from({ length: v.length }, (_, i) => `{${i}}`)
  const out = call(v, ph)
  if (out === undefined) return { skip: 'throws or returns non-string for placeholder args' }
  if (/NaN|undefined|\[object /.test(out)) return { skip: `lossy render: ${out.slice(0, 60)}` }
  // Interpolation check: substituting a probe value into the positional template must equal
  // calling the function with that value. Any difference means the function branches on it.
  for (let i = 0; i < ph.length; i++) {
    for (const value of probes) {
      const args = ph.slice(); args[i] = value
      const real = call(v, args)
      if (real === undefined) continue  // the call site never passes this type; not evidence
      const expected = out.split(ph[i]).join(String(value))
      if (real !== expected) return { skip: `conditional on arg ${i} (${JSON.stringify(value)}): ${out.slice(0, 50)}`, conditional: true }
    }
  }
  return { text: out }
}
const en = flat(await load('en', 'en')), ko = flat(await load('ko', 'ko'))
const allowed = new Set(JSON.parse(readFileSync(resolve(a.keys), 'utf8')).keys)
const entries = [], report = { translated: 0, sameAsEnglish: 0, notInInstalledKeys: 0, skipped: [] }
for (const key of Object.keys(ko).sort()) {
  if (!allowed.has(key)) { report.notInInstalledKeys++; continue }
  const k = render(ko[key]), e = en[key] === undefined ? {} : render(en[key])
  if (k.skip) { report.skipped.push(`${key}: ${k.skip}`); continue }
  // English branching only on numbers is pluralisation, which Korean does not inflect, so an
  // interpolating Korean string stays faithful. English branching on booleans or missing values
  // (on/off, show/hide, optional parts) means the call site expects different wording: exclude.
  if (e.conditional && en[key] !== undefined && render(en[key], SEMANTIC).conditional) {
    report.skipped.push(`${key}: English entry branches on a non-numeric argument (${e.skip})`); continue
  }
  if (k.text === e.text) { report.sameAsEnglish++; continue }  // English fallback, not a translation
  entries.push([key, k.text]); report.translated++
}
// Flat dotted keys, JSON-quoted values (valid YAML, no reserved-word or colon surprises).
const rev = dir => { try { return execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() } catch { return 'unknown' } }
const keysPath = resolve(a.keys)
const header = [
  '# Hermes Desktop Korean strings (ko.desktop.yaml)',
  '# Generated by tools/convert.mjs. Do not edit by hand; fix the source catalog and regenerate.',
  `# source: hermes-agent ${rev(src)} (Korean catalog from NousResearch/hermes-agent#40716)`,
  `# keys: ${allowed.size} Desktop keys from hermes-agent ${rev(join(keysPath, '..', '..'))}`,
  `# translated: ${entries.length}`,
  ''].join('\n') + '\n'
writeFileSync(resolve(a.out), header + entries.map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join('\n') + '\n')
console.log(JSON.stringify({ ...report, skipped: report.skipped.length, installedKeys: allowed.size }, null, 1))
writeFileSync(resolve('build/skipped.txt'), report.skipped.join('\n') + '\n')
