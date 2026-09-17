import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChapterShell } from '../components/ChapterShell'
import { loadMarkdown } from '../content'
import { findChapter, parts } from '../chapters'
import { renderMarkdown, type TocItem } from '../lib/renderMarkdown'
import { useOutline } from '../site/outline'

function partName(slug: string): string {
  for (const p of parts) {
    if (p.chapters.some((c) => c.slug === slug)) return p.name
  }
  return ''
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function MarkdownChapter({ slug }: { slug: string }) {
  const me = findChapter(slug)
  const { hash } = useLocation()
  const { setOutline, setActiveId } = useOutline()
  const [html, setHtml] = useState('')
  const [err, setErr] = useState('')
  const [toc, setToc] = useState<TocItem[]>([])

  useEffect(() => {
    if (!me) return
    let cancelled = false
    setHtml('')
    setErr('')
    setToc([])
    setOutline([])
    loadMarkdown(me.file)
      .then((raw) => {
        if (cancelled) return
        const next = renderMarkdown(raw)
        setHtml(next.html)
        setToc(next.outline)
        setOutline(next.outline)
      })
      .catch((e: Error) => {
        if (!cancelled) setErr(e.message)
      })
    return () => {
      cancelled = true
      setOutline([])
    }
  }, [me, setOutline])

  useEffect(() => {
    if (!html) return
    const id = decodeURIComponent(hash.replace(/^#/, ''))
    if (!id) return
    const t = window.requestAnimationFrame(() => scrollToId(id))
    return () => window.cancelAnimationFrame(t)
  }, [html, hash])

  useEffect(() => {
    if (!html || toc.length === 0) return
    const root = document.querySelector('.content')
    if (!root) return
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const id = vis[0]?.target.id
        if (id) setActiveId(id)
      },
      { root, rootMargin: '0px 0px -65% 0px', threshold: 0.01 },
    )
    for (const it of toc) {
      const el = document.getElementById(it.id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [html, toc, setActiveId])

  if (!me) return <div className="page">未找到章节：{slug}</div>
  if (err) return <div className="page">{err}</div>

  return (
    <ChapterShell slug={slug} part={partName(slug)}>
      {html
        ? <div className="md-body" dangerouslySetInnerHTML={{ __html: html }} />
        : <p className="page-loading">加载中…</p>}
    </ChapterShell>
  )
}
