import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { parts, chapterPath, findChapter } from '../chapters'
import { ProgressProvider, useProgress } from './progress'
import { OutlineProvider, useOutline } from './outline'
import { SearchPalette } from './SearchPalette'
import { useDocMeta } from './useDocMeta'

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const { pathname } = useLocation()
  const { isVisited } = useProgress()
  return (
    <nav className="sidebar" aria-label="全书导航">
      <Link to="/" className={`side-home ${pathname === '/' ? 'is-active' : ''}`} onClick={onNavigate}>
        全书大纲
      </Link>
      {parts.map((part) => (
        <div className="side-part" key={part.name}>
          <div className="side-part-name">{part.name}</div>
          <ul>
            {part.chapters.map((c) => {
              const live = c.status === 'live'
              const path = chapterPath(c)
              const active = pathname === path
              const done = live && isVisited(c.slug)
              return (
                <li key={c.slug}>
                  {live ? (
                    <NavLink to={path} onClick={onNavigate}
                      className={`side-link ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}>
                      <span className="side-num">{done ? '✓' : c.num}</span>
                      <span className="side-title">{c.title}{c.core && <span className="side-star"> ★</span>}</span>
                    </NavLink>
                  ) : (
                    <span className="side-link is-planned" title="规划中">
                      <span className="side-num">{c.num}</span>
                      <span className="side-title">{c.title}</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function PageToc() {
  const { items, activeId, setActiveId } = useOutline()
  if (items.length === 0) return null

  const jump = (id: string) => {
    setActiveId(id)
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    history.replaceState(null, '', `#${encodeURIComponent(id)}`)
  }

  return (
    <nav className="pagetoc" aria-label="本页目录">
      <div className="pagetoc-kicker">本页</div>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`pagetoc-link ${activeId === it.id ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                jump(it.id)
              }}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Shell() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 900 : true)
  const contentRef = useRef<HTMLElement>(null)
  const { markVisited } = useProgress()
  const { items } = useOutline()

  useDocMeta()

  useEffect(() => { contentRef.current?.scrollTo(0, 0) }, [pathname])

  useEffect(() => {
    if (!pathname.startsWith('/ch/')) return
    const slug = pathname.slice('/ch/'.length)
    if (!findChapter(slug)) return
    const t = window.setTimeout(() => markVisited(slug), 1200)
    return () => window.clearTimeout(t)
  }, [pathname, markVisited])

  const closeIfNarrow = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) setOpen(false)
  }

  return (
    <div className={`shell ${open ? 'nav-open' : 'nav-closed'}`}>
      <header className="topbar">
        <div className="topbar-left">
          <button className="nav-toggle" onClick={() => setOpen((o) => !o)}
            aria-label="切换全局导航" aria-expanded={open}>
            <span className="nav-toggle-icon">{open ? '✕' : '☰'}</span>
          </button>
          <Link to="/" className="wordmark">
            中文对照 <span className="arrow">→</span> 英语
          </Link>
        </div>
        <nav className="topnav">
          <SearchPalette />
          <a href="https://ielts.fim.ai" target="_blank" rel="noreferrer">雅思白皮书</a>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>大纲</NavLink>
        </nav>
      </header>

      <div className={`body ${items.length ? 'has-pagetoc' : ''}`}>
        {open && <Sidebar onNavigate={closeIfNarrow} />}
        {open && <div className="nav-scrim" onClick={() => setOpen(false)} />}
        <main className="content" ref={contentRef}>
          <Outlet />
          <footer className="site-footer">
            <span>© 2026 <a href="https://fim.ai" target="_blank" rel="noreferrer">FIM Labs</a></span>
            <span>英语名录 · 写给中文使用者的基础读本</span>
          </footer>
        </main>
        <PageToc />
      </div>
    </div>
  )
}

export function Layout() {
  return (
    <ProgressProvider>
      <OutlineProvider>
        <Shell />
      </OutlineProvider>
    </ProgressProvider>
  )
}
