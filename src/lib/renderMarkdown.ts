import { marked, Renderer, type Tokens } from 'marked'
import { WIKI_SLUG } from '../chapters'

export type TocItem = { id: string; text: string }

function wiki(src: string): string {
  return src.replace(/\[\[([^\]|#]+)(?:#[^\]]+)?\]\]/g, (_m, name: string) => {
    const title = String(name).trim()
    const slug = WIKI_SLUG[title]
    return slug ? `[${title}](/ch/${slug})` : title
  })
}

function stripTitle(src: string): string {
  return src.replace(/^#[^#\n].*\n+/, '')
}

/** 去掉文首「📖 目录」整块，改由侧栏二级目录承担。 */
export function stripToc(src: string): string {
  const lines = src.split('\n')
  const start = lines.findIndex((l) => /^##\s+.*目录/.test(l))
  if (start < 0) return src
  let end = start + 1
  while (end < lines.length) {
    if (/^##\s+/.test(lines[end]) && !/目录/.test(lines[end])) break
    end++
  }
  return [...lines.slice(0, start), ...lines.slice(end)].join('\n').replace(/\n{3,}/g, '\n\n')
}

const DECOR = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}⭐🌟📌📖⚡🎯💡📝✨💎🔥⚠️✅❌]/gu

function githubSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
}

function cleanLabel(text: string): string {
  return text
    .replace(/[*_`]/g, '')
    .replace(/[0-9]\uFE0F?\u20E3/g, '')
    .replace(DECOR, '')
    .replace(/\uFE0F|\u20E3/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

export function renderMarkdown(src: string): { html: string; outline: TocItem[] } {
  const prepared = wiki(stripTitle(stripToc(src)))
  const seen = new Map<string, number>()
  const outline: TocItem[] = []
  const renderer = new Renderer()

  renderer.heading = function ({ tokens, depth, text }: Tokens.Heading) {
    const label = cleanLabel(text)
    let id = githubSlug(label) || `h${depth}`
    const n = (seen.get(id) ?? 0) + 1
    seen.set(id, n)
    if (n > 1) id = `${id}-${n}`
    if (depth === 2) outline.push({ id, text: label })
    const inner = this.parser.parseInline(tokens)
    return `<h${depth} id="${escAttr(id)}">${inner}</h${depth}>\n`
  }

  const html = marked.parse(prepared, { async: false, renderer }) as string
  return { html, outline }
}
