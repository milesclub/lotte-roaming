// Inlines the Vite build (one JS chunk + one CSS file) into a single,
// self-contained HTML artifact that runs from file:// with no server.
// Run after `vite build`:  node scripts/build-singlefile.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const htmlPath = join(dist, 'index.html')
const out = join(root, 'lotte-roaming-standalone.html')

if (!existsSync(htmlPath)) {
  console.error('dist/index.html not found — run `npm run build` first.')
  process.exit(1)
}

let html = readFileSync(htmlPath, 'utf8')

// Guard the inlined payloads so embedded "</script>"/"</style>" can't break out.
const safeScript = (s) => s.replace(/<\/(script)/gi, '<\\/$1')
const safeStyle = (s) => s.replace(/<\/(style)/gi, '<\\/$1')

// 1) Inline the JS module: <script type="module" ... src="./assets/x.js"></script>
html = html.replace(
  /<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/gi,
  (_m, src) => {
    const code = readFileSync(join(dist, src.replace(/^\.?\//, '')), 'utf8')
    return `<script type="module">\n${safeScript(code)}\n</script>`
  },
)

// 2) Inline the stylesheet: <link rel="stylesheet" ... href="./assets/x.css">
html = html.replace(
  /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/gi,
  (_m, href) => {
    const css = readFileSync(join(dist, href.replace(/^\.?\//, '')), 'utf8')
    return `<style>\n${safeStyle(css)}\n</style>`
  },
)

// 3) Inline the icon as a data URI; drop the external manifest (not needed for
//    a standalone file).
const iconPath = join(dist, 'icon.svg')
if (existsSync(iconPath)) {
  const dataUri = `data:image/svg+xml;base64,${readFileSync(iconPath).toString('base64')}`
  html = html.replace(/href="\.?\/icon\.svg"/g, `href="${dataUri}"`)
}
html = html.replace(/\s*<link\b[^>]*\brel="manifest"[^>]*>/gi, '')

writeFileSync(out, html)

const kb = (n) => `${(n / 1024).toFixed(1)} kB`
console.log(`✓ wrote ${out}`)
console.log(`  size: ${kb(Buffer.byteLength(html))} (single self-contained HTML)`)
