# NIEL. — Personal Developer Portfolio & AI Platform

**Tagline:** `CREATE. CODE. INNOVATE.`  
**Identity:** `NIEL — INFORMATICS ENGINEERING STUDENT`

NIEL. is a full-stack multi-page personal developer portfolio and interactive IT learning platform combining:

1. **Personal Portfolio** — Home, Featured Projects, Project Detail Case Studies, About & Editable Education Timeline, and Contact Inbox.
2. **Niel AI** — Bilingual AI Tutor & Coding Assistant supporting **English** and **Bahasa Indonesia** via server-side Gemini API streaming (`@google/genai`), anonymous session persistence, daily usage quotas, and a side-by-side Coding Workspace.
3. **IT Learning Hub** — Categorized Computer Science study modules, 5 learning roadmaps, interactive topic quizzes, and searchable code snippets.
4. **Code Playground** — Live isolated browser sandbox (`iframe sandbox="allow-scripts"`) for HTML, CSS, and JavaScript experiments with live console & error output.
5. **Technology Blog** — Searchable technical articles with Markdown rendering and related posts.
6. **Protected Admin Workspace (`/admin`)** — Google Sign-In verified server-side via `firebase-admin` + Firestore Security Rules to manage projects, articles, learning materials, education/profile info, contact inbox, and AI configuration.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, `react-markdown` + `remark-gfm`
- **Backend:** Express (`server.ts`) running via `tsx` on port `3000`, `@google/genai` SSE streaming
- **Database & Auth:** Firebase Firestore (`firebase` client SDK + `firebase-admin` server token verification) & Firebase Google Auth

---

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your server-side secrets:
   - `GEMINI_API_KEY`: Server-side Gemini API key (never exposed to client bundle).
   - `ADMIN_EMAIL_ALLOWLIST`: Comma-separated Google account emails allowed into `/admin`.
   - `AI_DAILY_LIMIT_PER_SESSION`: Daily Niel AI quota per anonymous browser session (default `30`).
   - `AI_MAX_INPUT_LENGTH`: Maximum characters per user message (default `2000`).

3. **Run development server (port 3000):**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## Security Architecture

- `GEMINI_API_KEY` is read strictly on the server inside `server.ts` and never sent to client code.
- Admin API endpoints (`/api/admin/*`) enforce `Authorization: Bearer <Firebase ID Token>` checked with `firebase-admin` and `ADMIN_EMAIL_ALLOWLIST`.
- Browser sandbox execution in Playground and AI Preview runs inside a restricted `iframe` (`sandbox="allow-scripts"`) with zero access to cookies or parent storage.
- Per-IP burst rate limiting and per-session daily message caps protect AI endpoints from abuse.
