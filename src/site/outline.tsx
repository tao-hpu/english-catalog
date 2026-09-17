import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { TocItem } from '../lib/renderMarkdown'

interface OutlineApi {
  items: TocItem[]
  activeId: string
  setOutline: (items: TocItem[]) => void
  setActiveId: (id: string) => void
}

const Ctx = createContext<OutlineApi | null>(null)

export function OutlineProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  const setOutline = useCallback((next: TocItem[]) => {
    setItems(next)
    setActiveId('')
  }, [])

  const api = useMemo<OutlineApi>(
    () => ({ items, activeId, setOutline, setActiveId }),
    [items, activeId, setOutline],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useOutline(): OutlineApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useOutline 必须在 OutlineProvider 内使用')
  return ctx
}
