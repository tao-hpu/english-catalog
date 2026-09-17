import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const KEY = 'english-catalog:visited'

function load(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

interface ProgressApi {
  visited: Set<string>
  isVisited: (slug: string) => boolean
  markVisited: (slug: string) => void
  reset: () => void
}

const Ctx = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [visited, setVisited] = useState<Set<string>>(() => new Set(load()))

  const persist = useCallback((next: Set<string>) => {
    setVisited(next)
    try {
      window.localStorage.setItem(KEY, JSON.stringify([...next]))
    } catch {
      /* ignore */
    }
  }, [])

  const markVisited = useCallback((slug: string) => {
    setVisited((prev) => {
      if (prev.has(slug)) return prev
      const next = new Set(prev)
      next.add(slug)
      try {
        window.localStorage.setItem(KEY, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const reset = useCallback(() => persist(new Set()), [persist])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setVisited(new Set(load()))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const api = useMemo<ProgressApi>(
    () => ({ visited, isVisited: (s) => visited.has(s), markVisited, reset }),
    [visited, markVisited, reset],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress 必须在 ProgressProvider 内使用')
  return ctx
}
