# ShadowLens (Vercel-ready Next.js app)

ShadowLens is a production-style web app for discovering shadow AI usage, scoring tool risk, and exporting governance reports.

## Stack

- Next.js App Router (React + TypeScript)
- API routes for dashboard data and CSV reporting
- Vercel-ready deployment (`next build` / `next start`)

## Features implemented

- AI tool discovery dashboard with filters (department, device, approval status, time window)
- Tool risk scoring and ranking
- KPI cards (total tools/events, high-risk tools, unapproved usage)
- Usage timeline visualization
- CSV report export via API route

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project**.
3. Import the repository.
4. Framework preset should auto-detect as **Next.js**.
5. Click **Deploy**.

No special environment variables are required for this prototype.

## API endpoints

- `GET /api/events` – filtered dashboard payload
- `GET /api/report` – downloadable CSV report

Query params accepted by both routes:

- `department=all|...`
- `device=all|...`
- `status=all|approved|pending|unapproved`
- `windowDays=7|14|30`
