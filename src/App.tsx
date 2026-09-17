import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { Layout } from './site/Layout'
import { Home } from './pages/Home'
import { MarkdownChapter } from './pages/MarkdownChapter'
import { findChapter } from './chapters'
import './site.css'

function ChapterRoute() {
  const { slug = '' } = useParams()
  const ch = findChapter(slug)
  if (!ch || ch.status !== 'live') {
    return <div className="page">未找到章节：{slug}</div>
  }
  return <MarkdownChapter slug={slug} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ch/:slug" element={<ChapterRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
