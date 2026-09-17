# 英语名录

写给中文使用者的英语基础读本。中英对照，按章节查时态、从句和词块。

**线上 →** [english.fim.ai](https://english.fim.ai)

**本地预览 →** `pnpm install && pnpm dev`（http://localhost:5193）

中文和英文不是同一套时、体、状态。本书把差异摊开，再按结构、时态、从句往下讲。开口靠跟读；雅思应试见 [ielts.fim.ai](https://ielts.fim.ai)。

## 大纲（4 部分 · 20 节）

1. **对照与用法** — 中英对照总表 · 日常练习方法
2. **语法教程** — 全景 · 句型 · 时态 · Have/情态 · 名词 · 形副 · 介词 · 从句 · 非谓语 · 被动/虚拟
3. **词块与场景** — 高频词块 · 开会功能句
4. **雅思题型** — 听 / 读 / 说 / Task 1 / Task 2 / 同替（评分与训练闭环见白皮书）

章节清单的唯一事实来源是 `src/chapters.ts`。正文在 `content/*.md`。

## 技术栈

Vite + React 18 + TypeScript。Markdown 用 `marked` 渲染。骨架与 [ielts.fim.ai](https://ielts.fim.ai) / [l2a.fim.ai](https://l2a.fim.ai) 同源。

```bash
pnpm install
pnpm dev      # http://localhost:5193
pnpm build    # 产物在 dist/
```
