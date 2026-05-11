# Progress

[2026-05-10] Pushed multica-kb.patch to Cabinet's claude/self-hosted-knowledge-base-eY4Vo branch on GitHub (session MCP token is Cabinet-only; Multica push was blocked). Patch applies all 23 KB files to TheophilusChinomona/multica. Apply with: curl -L <patch-url> | git am --3way from the Multica root.

[2026-05-10] Rewrote Cabinet README to reflect the simplified self-hosted knowledge base scope: removed all AI agent, terminal, scheduler, and mission control content; updated feature table, architecture section, and commands to match the current file-tree KB product. Updated `npm run dev` as the sole command.

[2026-05-10] Ported Cabinet's file tree system into Multica fork (TheophilusChinomona/multica) as a self-contained Knowledge Base feature: created storage layer (apps/web/lib/kb/), Next.js route handlers (app/api/kb/), Zustand stores (kb-tree-store, kb-editor-store), KB UI components (sidebar tree, editor wrapper, KB shell), new route (/[workspaceSlug]/kb), sidebar nav item, i18n labels, and KB_DATA_DIR env var. Changes committed on branch claude/self-hosted-knowledge-base-eY4Vo in Multica repo.

[2026-05-10] Stripped Cabinet down to a pure self-hosted knowledge base: removed AI agents, terminal, tasks, jobs, AI panel, and registry from the UI layer. Modified app-store.ts (stubs for terminal/AI panel methods, removed task panel and terminal tabs state), app-shell.tsx (removed 9 component imports and renders, replaced SSE with 10s polling, removed onboarding gate), and tree-view.tsx (removed Agents section, Tasks section, agent polling, and all agent-related icons/types). All backend files preserved.

[2026-04-16] Claude Code model labels now include version numbers in the runtime picker ("Claude Opus 4.7", "Claude Sonnet 4.6", "Claude Haiku 4.5"), with Opus listed first.

[2026-04-16] Runtime picker: fixed gap between tabs and model table by wrapping the TabsList in a flex container, eliminating the CSS inline-flex baseline descender space that was adding ~4px below the tab buttons. Inactive tabs now use bg-muted/60 so the active tab stands out clearly.

[2026-04-16] COO heartbeat for Text Your Mom: delivered mid-week operating review (Apr 14 week). Audited Tuesday Proof-of-Life — all three cabinets missed (app-dev, TikTok, Reddit). Identified TikTok image-creator produced two script-ready briefs today (first marketing output ever). Reddit remains dark with zero job runs. Created content-calendar/index.md for TikTok, appended COO review to company/operations, updated COO memory, and sent urgent messages to CEO, Reddit researcher, and DevOps agent.
