import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { findChapter } from '../chapters'

const SITE = '英语名录'
const DEFAULT_DESC = '写给中文使用者的英语基础读本。中英对照，按章节查时态、从句和词块。'

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useDocMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const slug = pathname.startsWith('/ch/') ? pathname.slice('/ch/'.length) : ''
    const c = slug ? findChapter(slug) : undefined

    const title = c ? `${c.num} ${c.title} · ${SITE}` : `${SITE} · 英语基础读本`
    const desc = c ? c.hook : DEFAULT_DESC

    document.title = title
    setMeta('description', desc)
    setProperty('og:title', title)
    setProperty('og:description', desc)
    setProperty('og:type', 'website')
    setProperty('og:url', `https://english.fim.ai${c ? `/ch/${slug}` : ''}`)
    setMeta('twitter:title', title)
    setMeta('twitter:description', desc)
  }, [pathname])
}
