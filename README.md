# All-A System — Developer Quickstart

Minimal notes to run and debug this repository locally.

**Run (development)**
- From the repo root run the ESM server (preferred):

```bash
npm install
npm run dev
```

- Or run the CommonJS backend variant (useful for experimenting with `backend` dependencies):

```bash
cd backend
node server.js
```

The server listens on `PORT` (defaults to `3001`). The React UI component `src/APP.jsx` expects the API at `http://localhost:3001/api/dashboard`.

**Environment**
- Copy `.env.example` to `.env` and populate values:
  - `GOOGLE_SHEET_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY` (use escaped `\n` sequences as shown in `.env.example`)

**Google Sheets format**
- The backend reads two tabs named exactly: `Students` and `Fees`.
- Columns expected for `Students`: `id`, `name`, `level`, `subject`, `status`, `phone`, `lastPayment`.
- Columns expected for `Fees`: `id`, `student`, `amount`, `date`, `method`, `status`.

**Frontend behavior**
- `src/APP.jsx` fetches `GET /api/dashboard`. If the server is unreachable, the UI falls back to built-in `MOCK_STUDENTS` and `MOCK_FEES` and shows `DEMO MODE`.

**Editing notes**
- There are two server files implementing the same API: `server.js` (root, ESM) and `backend/server.js` (CommonJS). Prefer editing the root `server.js` for canonical changes.
- The code uses `row.get('columnName')` to read spreadsheet row values — keep header names stable.

**Troubleshooting**
- If you see `DEMO MODE` in the UI, start the backend and check console logs for errors (missing sheets, auth errors).
- Ensure the service account has access to the spreadsheet and credentials are correct.

If you'd like, I can add a `Makefile`, a script to run frontend+backend concurrently, or CI steps next.

**Example Google Sheets CSV (paste into Sheets or import CSV)**

Students.csv
```
id,name,level,subject,status,phone,lastPayment
S001,Ali bin Abu,Form 5,SPM Add Maths,Active,+6012-3456789,2025-10-01
S002,Sarah Lim,Year 11,IGCSE Physics,Active,+6017-8889999,2025-10-02
S003,Muthu Kumar,Form 4,SPM Modern Maths,Pending,+6019-2223333,-
```

Fees.csv
```
id,student,amount,date,method,status
T1001,Ali bin Abu,120,2025-10-01,Card,Verified
T1002,Sarah Lim,150,2025-10-02,Transfer,Verified
T1003,Muthu Kumar,120,-,Cash,Unpaid
```

**Run both servers concurrently**
- After installing dependencies, run both servers (root ESM server + backend CommonJS server) with:

```bash
npm install
npm run dev:all
```

This uses `concurrently` (added as a devDependency) to start `nodemon server.js` and `node backend/server.js` together.

**Production build & serve**
- To build the client and serve it from the root server, run:

```bash
# from repo root
npm install
npm run build      # builds the client into client/dist
npm run start:prod # starts the root server with NODE_ENV=production
```

- The root server will serve the built client from `client/dist` and continue to expose the API at `/api/dashboard`.
