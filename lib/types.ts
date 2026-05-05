export type TagType = 'general' | 'study' | 'work' | 'ideas' | 'important' | 'code'

export interface Note {
  id: string
  title: string
  body: string
  tag: TagType
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export interface Flashcard {
  front: string
  back: string
}

export const TAG_META: Record<TagType, { label: string; color: string; bg: string; border: string }> = {
  general:   { label: 'General',   color: '#5b4cf5', bg: '#ede9ff', border: '#c4b8ff' },
  study:     { label: 'Study',     color: '#0891b2', bg: '#e0f9ff', border: '#67e8f9' },
  work:      { label: 'Work',      color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
  ideas:     { label: 'Ideas',     color: '#be185d', bg: '#fce7f3', border: '#f9a8d4' },
  important: { label: 'Important', color: '#dc2626', bg: '#ffe4e6', border: '#fca5a5' },
  code:      { label: 'Code',      color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
}

export const SAMPLE_NOTES: Note[] = [
  {
    id: '1',
    title: 'Welcome to NeuroNote ✦',
    body: `# Welcome to NeuroNote

Your **futuristic** knowledge base is ready.

## What you can do:
- Paste and organize notes with **tags**
- **Search** through everything instantly
- Render **Markdown** beautifully
- Generate **Flashcards** from any note
- Export to **PDF** or **TXT**
- Toggle between **Edit** and **Preview** modes

> Tip: Press \`Ctrl+N\` to create a new note quickly.

Start by creating your first note!`,
    tag: 'general',
    pinned: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: '2',
    title: 'Study Tips & Techniques',
    body: `# Study Techniques

## The Big Three
1. **Active Recall** — Test yourself instead of re-reading
2. **Spaced Repetition** — Review at increasing intervals
3. **The Feynman Technique** — Explain it simply

## Pomodoro Method
- 25 min focused work
- 5 min break
- Every 4 cycles → 20 min long break

## Notes
Use \`code blocks\` for formulas and **bold** for key terms.`,
    tag: 'study',
    pinned: false,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '3',
    title: 'Project Ideas',
    body: `# Ideas Backlog

## Tech Projects
- AI-powered task manager
- Personal knowledge graph
- Real-time collaboration tool

## Side Projects
- Photography portfolio site
- Recipe app with meal planning
- Budget tracker with charts

## Notes
Mark ideas with **high**, *medium*, or low priority.`,
    tag: 'ideas',
    pinned: false,
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  },
]
