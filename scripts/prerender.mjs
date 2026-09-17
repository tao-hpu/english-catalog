import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = '英语名录'
const BASE = 'https://english.fim.ai'

const src = readFileSync(join(root, 'src/chapters.ts'), 'utf8')
const chapters = []
for (const line of src.split('\n')) {
  if (!/\bslug:\s*'/.test(line)) continue
  const slug = line.match(/\bslug:\s*'([^']+)'/)?.[1]
  const num = line.match(/\bnum:\s*'([^']+)'/)?.[1]
  const title = line.match(/\btitle:\s*'([^']+)'/)?.[1]
  const hook = line.match(/\bhook:\s*'([^']+)'/)?.[1]
  const status = line.match(/\bstatus:\s*'([^']+)'/)?.[1]
  if (slug && num && title && hook && status === 'live') chapters.push({ slug, num, title, hook })
}
if (chapters.length === 0) {
  console.error('[prerender] 未解析到任何已上线章节，跳过')
  process.exit(0)
}

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const indexHtml = readFileSync(join(root, 'dist/index.html'), 'utf8')

function pageHtml({ t, hook, url }) {
  let html = indexHtml
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(t)}</title>`)
  const setAttr = (re, val) => { html = html.replace(re, (_m, a, b) => `${a}${escAttr(val)}${b}`) }
  setAttr(/(<meta name="description" content=")[^"]*(")/, hook)
  setAttr(/(<meta property="og:title" content=")[^"]*(")/, t)
  setAttr(/(<meta property="og:description" content=")[^"]*(")/, hook)
  setAttr(/(<meta property="og:url" content=")[^"]*(")/, url)
  setAttr(/(<meta name="twitter:title" content=")[^"]*(")/, t)
  setAttr(/(<meta name="twitter:description" content=")[^"]*(")/, hook)
  setAttr(/(<link rel="canonical" href=")[^"]*(")/, url)
  return html
}

let n = 0
for (const c of chapters) {
  const url = `${BASE}/ch/${c.slug}`
  const dir = join(root, 'dist/ch', c.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), pageHtml({ t: `${c.num} ${c.title} · ${SITE}`, hook: c.hook, url }))
  n++
}
console.log(`[prerender] 已生成 ${n} 个章节的静态 meta 页 → dist/ch/<slug>/index.html`)

const urls = [
  `  <url><loc>${BASE}/</loc><priority>1.0</priority></url>`,
  ...chapters.map((c) => `  <url><loc>${BASE}/ch/${c.slug}</loc><priority>0.8</priority></url>`),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
writeFileSync(join(root, 'dist/sitemap.xml'), sitemap)
console.log(`[prerender] 已生成 sitemap.xml（${urls.length} 条 URL）→ dist/sitemap.xml`)
