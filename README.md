<p align="center">
  <img src="assets/cabinet-wordmark.svg" alt="cabinet /ˈkab.ɪ.nət/" width="920">
</p>

<h1 align="center">Cabinet — Self-Hosted Knowledge Base</h1>

<p align="center">
  <strong>A file-based knowledge base that lives on your machine.</strong><br />
  <sub>Markdown files on disk &nbsp;•&nbsp; WYSIWYG editing &nbsp;•&nbsp; Git-backed history &nbsp;•&nbsp; No database</sub>
</p>

<p align="center">
  Built by Hila Shmuel, former Engineering Manager at Apple.
</p>

<p align="center">
  <a href="https://x.com/HilaShmuel" target="_blank" rel="noopener noreferrer">@HilaShmuel</a>&nbsp; • &nbsp;
  <a href="https://runcabinet.com" target="_blank" rel="noopener noreferrer">runcabinet.com</a>&nbsp; • &nbsp;
  <a href="mailto:hi@runcabinet.com" target="_blank" rel="noopener noreferrer">hi@runcabinet.com</a>
</p>

---

## Quick Start

```bash
npx create-cabinet@latest
cd cabinet
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What is Cabinet?

Cabinet is a self-hosted knowledge base. All content lives as markdown files on disk — no database, no vendor lock-in, no data leaving your machine.

You get a collapsible file tree in the sidebar, a WYSIWYG editor, full-text search, and support for PDFs, CSVs, images, diagrams, and code files as first-class content types. Version history is backed by git: every save auto-commits, and you can restore any page to any previous state.

---

## Features

| Feature | What it does |
|---|---|
| **WYSIWYG Editor** | Rich text editing with Tiptap. Tables, code blocks, slash commands, markdown roundtrip. |
| **File Tree Sidebar** | Recursive tree navigation with drag-and-drop reordering and context menus. |
| **Multi-Cabinet** | Organize content into separate cabinets, each with their own tree and visibility settings. |
| **PDF & CSV Viewers** | First-class support for PDFs and spreadsheets inline in the UI. |
| **Image & Media** | Preview images, video, and audio files directly in the sidebar. |
| **Mermaid Diagrams** | `.mmd` files render as interactive flowcharts and sequence diagrams. |
| **Code Viewer** | Syntax-highlighted source viewer for 30+ file extensions. |
| **Embedded Apps** | Drop `index.html` in a folder — renders as an iframe. Full-screen mode available. |
| **Full-Text Search** | Cmd+K instant search across all pages with fuzzy matching. |
| **Git-Backed History** | Every save auto-commits. Full diff viewer. Restore any page to any point in time. |
| **Dark/Light Mode** | Theme toggle. Dark mode by default. |

---

## Architecture

```
cabinet/
  src/
    app/api/tree/          -> GET file tree from /data
    app/api/pages/[...]/   -> GET/PUT/POST/DELETE/PATCH pages
    app/api/assets/[...]/  -> Static file serving
    app/api/search/        -> Full-text search
    app/api/git/           -> Version history, diff, restore
    components/sidebar/    -> File tree, context menus, drag-and-drop
    components/editor/     -> Tiptap WYSIWYG + toolbar + file viewers
    components/search/     -> Cmd+K search dialog
    components/settings/   -> Settings page
    stores/                -> Zustand (tree-store, editor-store, app-store)
    lib/storage/           -> Filesystem ops (page CRUD, tree builder)
    lib/markdown/          -> Markdown ↔ HTML conversion
    lib/git/               -> Git auto-commit and version history
  data/                    -> Content directory (your markdown files)
```

**Tech stack:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Tiptap, Zustand, gray-matter, simple-git

---

## Requirements

- **Node.js** 20+
- macOS or Linux (Windows via WSL)

## Configuration

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|----------|---------|-------------|
| `KB_PASSWORD` | _(empty)_ | Password to protect the UI. Leave empty for no auth. |
| `DOMAIN` | `localhost` | Domain for the app. |

## Commands

```bash
npm run dev     # Next.js dev server on localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

---

## How pages work

- Pages are directories containing `index.md` + optional assets, or standalone `.md` files.
- Frontmatter (YAML) stores metadata: `title`, `created`, `modified`, `tags`, `icon`, `order`.
- PDFs, CSVs, images, video, audio, `.mmd` (Mermaid), and code files appear in the sidebar as first-class content.
- Directories with `index.html` but no `index.md` render as embedded apps (iframes). Add a `.app` marker for full-screen mode.

---

Cabinet is free, open source, and self-hosted. Your data never leaves your machine.

---

MIT License
