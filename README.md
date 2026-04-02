# ShadowLens (Next.js app)

ShadowLens is a production-style web app for discovering shadow AI usage, scoring tool risk, and exporting governance reports.

## Stack

- Next.js App Router (React + TypeScript)
- API routes for dashboard data and CSV reporting

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

## API endpoints

- `GET /api/events` – filtered dashboard payload
- `GET /api/report` – downloadable CSV report

Query params accepted by both routes:

- `department=all|...`
- `device=all|...`
- `status=all|approved|pending|unapproved`
- `windowDays=7|14|30`
