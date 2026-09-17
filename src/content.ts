export const loaders = import.meta.glob(
  ['../content/*.md', '!../content/errors.md'],
  { query: '?raw', import: 'default' },
) as Record<string, () => Promise<string>>

export function loadMarkdown(file: string): Promise<string> {
  const key = `../content/${file}`
  const loader = loaders[key]
  if (!loader) return Promise.reject(new Error(`没有这份正文：${file}`))
  return loader()
}
