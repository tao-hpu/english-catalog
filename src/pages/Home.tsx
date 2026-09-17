import { Link } from 'react-router-dom'
import { parts, chapterPath, firstLiveChapter } from '../chapters'

export function Home() {
  const start = firstLiveChapter()
  return (
    <div className="home">
      <header className="hero">
        <p className="hero-eyebrow">英语基础读本</p>
        <h1 className="hero-h1">
          中文和英文不是同一套语法。<br />
          这本<span className="hl">对照着讲</span>。
        </h1>
        <p className="hero-lede">
          写给以中文为母语的人。先分清哪些是中文习惯、哪些两边一样、哪些是英语自己的规则，
          再按章节查时态、从句、词块和常用场景。开口靠跟读；雅思应试见{' '}
          <a href="https://ielts.fim.ai">ielts.fim.ai</a>。
        </p>

        <div className="hero-meta">
          <span>20 节</span>
          <span>中英对照</span>
          <span>免费阅读</span>
        </div>

        <div className="hero-cta">
          {start && (
            <Link className="start-cta" to={chapterPath(start)}>
              从第 01 节开始 <span className="arrow">→</span>
            </Link>
          )}
          <a className="start-cta ghost" href="https://ielts.fim.ai">
            雅思白皮书
          </a>
        </div>
      </header>

      <section className="two-ideas">
        <div className="cardgrid">
          <div className="card">
            <span className="card-k">对照</span>
            <h4>先分清三件事</h4>
            <p>中文特色、两边相同、英文特色。后面每一节都用这张表读，避免把「了」当成英语的过去式。</p>
          </div>
          <div className="card">
            <span className="card-k">教程</span>
            <h4>从句子结构讲起</h4>
            <p>时态、从句、非谓语、词块，按章节排列。查一条规则、看一组例句，再回头对照。</p>
          </div>
        </div>
      </section>

      <section className="home-outline">
        <h2 className="outline-title">全书大纲 · 4 部分 20 节</h2>
        {parts.map((part) => (
          <div className="ol-part" key={part.name}>
            <div className="ol-part-head">
              <div className="ol-part-name">{part.name}</div>
              <div className="ol-part-blurb">{part.blurb}</div>
            </div>
            <ul className="ol-list">
              {part.chapters.map((c) => {
                const live = c.status === 'live'
                return (
                  <li key={c.slug}>
                    {live ? (
                      <Link className="ol-item" to={chapterPath(c)}>
                        <span className="ol-num">{c.num}</span>
                        <span className="ol-main">
                          <span className="ol-title">{c.title}{c.core && <span className="ol-star"> ★</span>}</span>
                          <span className="ol-hook">{c.hook}</span>
                        </span>
                        <span className="ol-bridge">{c.bridge}</span>
                      </Link>
                    ) : (
                      <span className="ol-item is-planned">
                        <span className="ol-num">{c.num}</span>
                        <span className="ol-main">
                          <span className="ol-title">{c.title}</span>
                          <span className="ol-hook">{c.hook}</span>
                        </span>
                        <span className="ol-bridge">规划中</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        <p className="outline-foot">
          ★ 最短主线：对照 → 方法 → 结构 → 时态 → 词块。第四部分是雅思题型表；评分与训练闭环在白皮书。
        </p>
      </section>
    </div>
  )
}
