// 全站唯一的章节清单。首页大纲、顶栏、上一页/下一页、prerender 都从这里读。
// 正文在 content/*.md，这一份只负责顺序、标题、这一节回答什么。

export type ChapterStatus = 'live' | 'planned'

export interface Chapter {
  slug: string
  num: string
  title: string
  hook: string
  bridge: string
  status: ChapterStatus
  core?: boolean
  file: string
}

export interface Part {
  name: string
  blurb: string
  chapters: Chapter[]
}

export const parts: Part[] = [
  {
    name: '第一部分 · 对照与用法',
    blurb: '先分清中英差异，再谈怎么练。',
    chapters: [
      { slug: 'contrast', num: '01', title: '中英对照总表', hook: '哪些是中文特色，哪些相同，哪些是英文特色', bridge: '先看这一张表', status: 'live', core: true, file: 'contrast.md' },
      { slug: 'method', num: '02', title: '日常练习方法', hook: '听得懂说不出，管道怎么打通', bridge: '跟读是主课', status: 'live', core: true, file: 'method.md' },
    ],
  },
  {
    name: '第二部分 · 语法教程',
    blurb: '从句子结构到时态、从句、非谓语。',
    chapters: [
      { slug: 'structure', num: '03', title: '语法结构全景', hook: '英语一共有多少种语法结构', bridge: '演员 / 角色 / 剧本', status: 'live', core: true, file: 'structure.md' },
      { slug: 'patterns', num: '04', title: '五大基本句型', hook: '一句话的骨架长什么样', bridge: 'SV / SVO / SVC…', status: 'live', file: 'patterns.md' },
      { slug: 'tense', num: '05', title: '助动词与时态', hook: 'Do / Be / Have 和动词链', bridge: '语法核心', status: 'live', core: true, file: 'tense.md' },
      { slug: 'have', num: '06', title: 'Have 与情态动词', hook: 'have 的三重身份，情态后面永远原形', bridge: '时态篇的补丁', status: 'live', file: 'have.md' },
      { slug: 'nouns', num: '07', title: '名词、冠词与代词', hook: 'a / the / 零冠词，he she it', bridge: '名词短语', status: 'live', file: 'nouns.md' },
      { slug: 'adj-adv', num: '08', title: '形容词、副词与比较级', hook: '修饰谁、比较级怎么做', bridge: '描写与程度', status: 'live', file: 'adj-adv.md' },
      { slug: 'prep', num: '09', title: '介词与短语动词', hook: '介词不是翻译，是搭配', bridge: '中式表达重灾区', status: 'live', file: 'prep.md' },
      { slug: 'clauses', num: '10', title: '三大从句', hook: '名词从句、定语从句、状语从句', bridge: '嵌句', status: 'live', file: 'clauses.md' },
      { slug: 'nonfinite', num: '11', title: '非谓语动词', hook: 'to do / doing / done，一句话只能一个谓语', bridge: '中国学生老大难', status: 'live', file: 'nonfinite.md' },
      { slug: 'passive', num: '12', title: '被动语态与虚拟语气', hook: 'be + V3，以及反事实退一档', bridge: 'If I had known', status: 'live', file: 'passive.md' },
    ],
  },
  {
    name: '第三部分 · 词块与场景',
    blurb: '整块调用，不要单词拼凑。',
    chapters: [
      { slug: 'chunks', num: '13', title: '高频词块', hook: '母语者是一块一块说的', bridge: '治中式英语', status: 'live', core: true, file: 'chunks.md' },
      { slug: 'meetings', num: '14', title: '开会功能句', hook: '开会拼的是预案，不是临场水平', bridge: '商务场景', status: 'live', file: 'meetings.md' },
    ],
  },
  {
    name: '第四部分 · 雅思详表',
    blurb: '题型与语料。备考方法见雅思白皮书。',
    chapters: [
      { slug: 'ielts-listening', num: '15', title: '听力题型与陷阱', hook: '丢分多半在定位和拼写', bridge: '详表', status: 'live', file: 'ielts-listening.md' },
      { slug: 'ielts-reading', num: '16', title: '阅读题型与解题套路', hook: '60 分钟怎么配速', bridge: '详表', status: 'live', file: 'ielts-reading.md' },
      { slug: 'ielts-speaking', num: '17', title: '口语句型与话题', hook: '框架和素材，不背整段模板', bridge: '详表', status: 'live', file: 'ielts-speaking.md' },
      { slug: 'ielts-task1', num: '18', title: '写作 Task 1', hook: '图表语言库', bridge: '详表', status: 'live', file: 'ielts-task1.md' },
      { slug: 'ielts-task2', num: '19', title: '写作 Task 2', hook: '立场、论点、例证、让步', bridge: '详表', status: 'live', file: 'ielts-task2.md' },
      { slug: 'ielts-vocab', num: '20', title: '高频词汇与同义替换', hook: '听说读写共享一条替换链', bridge: '详表', status: 'live', file: 'ielts-vocab.md' },
    ],
  },
]

export const allChapters: Chapter[] = parts.flatMap((p) => p.chapters)

export const chapterPath = (c: Chapter) => `/ch/${c.slug}`

export const firstLiveChapter = (): Chapter | undefined =>
  allChapters.find((c) => c.status === 'live')

export const findChapter = (slug: string): Chapter | undefined =>
  allChapters.find((c) => c.slug === slug)

export function neighbors(slug: string): { prev?: Chapter; next?: Chapter } {
  const i = allChapters.findIndex((c) => c.slug === slug)
  return {
    prev: i > 0 ? allChapters[i - 1] : undefined,
    next: i >= 0 && i < allChapters.length - 1 ? allChapters[i + 1] : undefined,
  }
}

export const WIKI_SLUG: Record<string, string> = {
  '英语助动词与时态系统完全指南': 'tense',
  '英语被动语态与虚拟语气完全指南': 'passive',
  '英语三大从句完全指南': 'clauses',
  '英语介词与短语动词完全指南': 'prep',
  '英语非谓语动词完全指南': 'nonfinite',
  '英语语法结构全景图': 'structure',
  '英语句型结构与五大基本句型': 'patterns',
  '英语名词冠词与代词完全指南': 'nouns',
  '英语形容词副词与比较级完全指南': 'adj-adv',
  '英语练习方法': 'method',
  '英语高频词块': 'chunks',
  '英语错题本': 'errors',
  '开会功能句完全指南': 'meetings',
}
