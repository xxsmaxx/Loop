# Project LOOP - AI Customer Feedback Intelligence Platform

Project LOOP is an AI-powered customer feedback intelligence platform built for the Zidio internship project.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth/Auth.js
- Claude API / Anthropic SDK
- Zod
- Recharts

## Features

- Workspace-based authentication
- Signup creates workspace and ADMIN user
- Role-based access control: ADMIN, ANALYST, VIEWER
- Manual feedback entry
- CSV bulk feedback upload
- Simulated feedback channel source
- Feedback inbox with search, filter, pagination
- Status workflow: NEW, REVIEWED, ACTIONED
- AI feedback classification
- Sentiment, sentiment score, feature area and themes
- Analytics dashboard with charts
- Ask LOOP grounded Q&A with feedback sources
- Voice of Customer report generation
- Saved reports and TXT export

## Demo Credentials

Admin:
admin@loop.com
Password: Demo@123

Analyst:
analyst@loop.com
Password: Demo@123

Viewer:
viewer@loop.com
Password: Demo@123

## Environment Variables

Create a .env file.

Required variables:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXTAUTH_SECRET="replace-with-secure-random-secret"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="demo_key"
ANTHROPIC_MODEL="claude-haiku-4-5"

Use demo_key for fallback AI demo mode.

Never commit real API keys or database passwords.

## Local Setup

Install dependencies:

npm install

Generate Prisma client:

npx prisma generate

Run migration:

npx prisma migrate dev

Seed demo data:

npx tsx prisma/seed.ts

Start development server:

npm run dev

Open:

http://localhost:3000

## Build

npm run build

## Deployment Notes

Recommended:

- Vercel for Next.js
- Neon or Supabase for PostgreSQL
- Add all environment variables in Vercel settings
- Run production migration:

npx prisma migrate deploy

## Security Notes

- All feedback, analytics, reports, themes and Ask LOOP data are filtered by authenticated workspaceId.
- RBAC is enforced server-side.
- VIEWER role is read-only.
- Claude API key is used only on server-side.
- Real secrets must not be pushed to GitHub.

## Submission Checklist

- Next.js 14 + TypeScript
- PostgreSQL + Prisma
- NextAuth authentication
- RBAC roles
- Seeded demo workspace
- 120+ feedback records
- Feedback inbox
- CSV import
- Simulated channel source
- Analytics charts
- AI classification
- Ask LOOP Q&A
- VoC report generation
- README and setup instructions
- No secrets committed