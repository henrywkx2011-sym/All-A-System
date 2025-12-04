# Copilot / AI Agent Instructions for All-A System

This file explains the minimal, actionable knowledge an AI coding agent needs to be immediately productive in this repository.

## Big Picture
- **Architecture**: Lightweight full-stack Node app. There are two server entrypoints:
  - Root ESM server: `server.js` (uses `import` syntax). This is the repository `main` per `package.json`.
  - `backend/server.js`: CommonJS variant (uses `require`). Both implement the same Google Sheets-backed API.
- **Frontend**: `src/APP.jsx` contains a React UI component (no app bundler config checked into the repo). The component expects a running backend at `http://localhost:3001/api/dashboard` and falls back to built-in `MOCK_*` data when offline.

## Important Files / Patterns
- `package.json` (root): scripts `start` and `dev` — `dev` runs `nodemon server.js`.
- `server.js` (root) and `backend/server.js`: core API logic. Look here for Google Sheets integration and expected sheet titles.
- `src/APP.jsx`: React component showing how the frontend consumes the API and the demo fallback behavior.
- `.env` expectations: keys used by the servers (see **Environment / Secrets** below).

## Data Flow & Service Boundaries
- The backend reads data from a Google Spreadsheet (via `google-spreadsheet`) and exposes one main endpoint:
  - `GET /api/dashboard` — returns `{ students, fees }` arrays.
- The frontend calls `http://localhost:3001/api/dashboard`. If the call fails, the UI switches to demo mode (uses `MOCK_STUDENTS` / `MOCK_FEES`).
- Google sheet column names must match how rows are accessed in the servers (the code expects header names like `id`, `name`, `level`, `subject`, `status`, `phone`, `lastPayment` for `Students`, and `id`, `student`, `amount`, `date`, `method`, `status` for `Fees`).

## Environment / Secrets
- Required environment variables (used by both servers):
  - `GOOGLE_SHEET_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`
  - `PORT` (optional, default `3001`)
- NOTE: `GOOGLE_PRIVATE_KEY` handling: code calls `process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')`. Store the private key in the `.env` with literal `\n` sequences (escaped newlines), not actual newlines, e.g. `-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----`.

## Developer Workflows (how to run & debug)
- Start the main server (preferred):
  - `npm run dev` (from repo root) — uses `nodemon server.js` (root ESM server).
- Or run the backend version directly:
  - `cd backend && node server.js` (CommonJS server) — useful when experimenting with `backend` dependencies.
- The UI expects the backend at port `3001`. If you change `PORT`, update `src/APP.jsx` fetch URL or set `PORT` accordingly.
- Debugging tips:
  - Both servers log errors to console; failed Google Sheets lookups will throw if a required sheet title is missing (e.g. `Students` or `Fees`).
  - When the frontend shows `DEMO MODE`, it means the fetch failed — inspect backend logs and `GOOGLE_*` env values.

## Project-Specific Conventions
- Two server flavors coexist (ESM at root, CommonJS in `backend/`). Prefer editing `server.js` in the root if you are updating the canonical API, because `package.json` `main` points there.
- The code expects Google Sheet tab names to be exact and uses `row.get('columnName')` to access fields — keep header names stable.
- CORS is enabled broadly (`app.use(cors())`) so the frontend can access the API from `localhost` during development.

## External Integrations
- Google APIs: `google-spreadsheet` and `google-auth-library` are the main integrations. Service account credentials are required.
- No hosted frontend or build pipeline present — the React `APP.jsx` is a component; if integrating into a full React app, ensure the bundler serves it and the backend URL matches.

## Examples (copy-paste snippets)
- Fetch endpoint used by the UI (from `src/APP.jsx`):
  - `fetch('http://localhost:3001/api/dashboard')`
- Private key replacement pattern (from `server.js`):
  - `const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');`

## When editing code — practical notes for AI agents
- Read both `server.js` files when changing API behavior; they are intended to be equivalent but use different module systems.
- Update the README or add scripts if you add a frontend bundler or CI steps — currently there is no `build` script for a client app.
- Avoid changing the expected sheet column names unless you also update both server files and the frontend mappings.

## What I did not find (and what to ask the human)
- No top-level README or contributing guide describing the intended deployment flow.
- No `.env.example` — ask the maintainer for a redacted example of `GOOGLE_PRIVATE_KEY` (with `\n`) and `GOOGLE_SHEET_ID`.

---
If anything here is unclear or you'd like additional lines (for example: a `.env.example`, CI steps, or a standard start script for running frontend + backend concurrently), tell me which piece you'd like expanded and I will update this file.
