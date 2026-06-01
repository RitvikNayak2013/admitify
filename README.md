# Admitify

Admitify is an AI-powered roadmap builder for students who want to work toward their dream universities in a realistic, ethical, and organized way.

Instead of pretending to predict admission outcomes, Admitify helps students understand their current profile, identify gaps, and turn their goals into weekly actions across academics, exams, extracurriculars, projects, leadership, research, awards, and portfolio proof.

Admitify is built for a hackathon demo, but the architecture is intentionally modular so real university data, counselor tools, authentication, and database persistence can be added later.

## What Admitify Does

Admitify helps a student answer:

- What should I work on this week?
- Which parts of my profile are strongest or weakest?
- What proof do I need to collect for my achievements?
- Which exams, projects, activities, and opportunities match my goals?
- How can I build a stronger, more authentic university application over time?

Admitify does **not** guarantee admission, calculate a "chance of admission," encourage fake achievements, or write dishonest application material.

## Core Experience

- Interactive first-run product tour
- Demo profile for judges, guests, or non-students
- Guided onboarding for real student profiles
- Dream Fit Readiness Score
- Explainable profile strength breakdown
- Dream university explorer with editable sample data
- Deterministic roadmap generator
- Weekly action planning
- Activity planner with improvement warnings
- Portfolio Vault for proof of achievements
- AI Coach with secure server-side OpenAI integration
- Usage limits to protect API credits during demos
- Local storage persistence for a no-login MVP

## Demo Flow

For the best hackathon walkthrough, open:

```text
/dashboard?tour=1
```

Suggested demo path:

1. Start with the interactive intro tour.
2. Choose the demo profile if the viewer is not a student.
3. Show the dashboard and Dream Fit Readiness Score.
4. Open the Roadmap and check off a task.
5. Open Dream Schools and add a university.
6. Open Activities and show how Admitify suggests stronger proof and measurable impact.
7. Open the Portfolio Vault and add evidence.
8. Open the AI Coach and ask: "What should I do this week?"

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- Framer Motion
- Recharts
- Local JSON seed data
- localStorage persistence
- Optional OpenAI Responses API integration
- Vercel-ready deployment

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Opens the main app workspace |
| `/dashboard` | Main student command center |
| `/dashboard?tour=1` | Forces the interactive intro tour |
| `/onboarding` | Guided student setup |
| `/universities` | Dream university explorer |
| `/profile-strength` | Detailed readiness breakdown |
| `/roadmap` | Weekly and long-term roadmap |
| `/activities` | Extracurricular planner |
| `/exams` | Exam planner |
| `/opportunities` | Opportunity matcher |
| `/vault` | Portfolio proof vault |
| `/counselor` | AI Coach |
| `/settings` | Profile and demo settings |

## Local Setup

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

## Environment Variables

Create a local `.env.local` file. This file should **never** be committed to GitHub.

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5
OPENAI_REASONING_EFFORT=minimal

AI_OPENAI_ENABLED=true
AI_DAILY_REQUEST_LIMIT=40
AI_DAILY_REQUEST_LIMIT_PER_CLIENT=5
AI_MIN_SECONDS_BETWEEN_REQUESTS=12
AI_MAX_CONTEXT_CHARS=16000
AI_MAX_OUTPUT_TOKENS=1200
```

Important:

- Use `OPENAI_API_KEY`, not `NEXT_PUBLIC_OPENAI_API_KEY`.
- Never paste your real API key into source code, screenshots, commits, README files, or public issues.
- `.env.local` is ignored by Git.
- `.env.example` is safe to commit because it contains no real secrets.

## AI Credit Protection

Admitify includes server-side usage limits before any OpenAI request is made.

The current demo controls include:

- Global daily AI request limit
- Per-visitor daily AI request limit
- Cooldown between requests
- Maximum context size
- Maximum output tokens
- Deterministic fallback responses when the API key is missing, disabled, rate-limited, or unavailable

To disable paid AI calls completely:

```env
AI_OPENAI_ENABLED=false
```

The app will still work using mock counselor responses.

## Deploying to Vercel

1. Push the project to GitHub.
2. Go to Vercel and import the GitHub repository.
3. Keep the framework preset as `Next.js`.
4. Add the environment variables from the section above in Vercel Project Settings.
5. Deploy.
6. Visit the production URL Vercel provides.

Do not put the OpenAI key in GitHub. Add it only in Vercel's Environment Variables panel.

## Data and Architecture

Seed data lives in:

- `lib/seed/universities.ts`
- `lib/seed/exams.ts`
- `lib/seed/opportunities.ts`
- `lib/seed/sampleProfile.ts`

Core product logic lives in:

- `lib/scoring.ts`
- `lib/roadmap.ts`
- `lib/storage.ts`
- `lib/types.ts`

AI logic lives in:

- `app/api/counselor/route.ts`
- `app/api/ai/status/route.ts`
- `lib/ai/server.ts`
- `lib/ai/usage-limit.ts`

The MVP uses local storage through a small storage abstraction, which makes it easier to replace with Supabase or another database later.

## Scoring Philosophy

Admitify uses deterministic, explainable readiness scoring.

The score is not an admission probability. It is a planning tool that helps students see which areas need more work.

Overall readiness is weighted as:

- Academics: 25
- Tests: 15
- Extracurricular depth: 20
- Awards: 10
- Projects and proof: 15
- Leadership: 10
- Narrative fit: 5

Every score includes:

- Numeric score
- Label
- Explanation
- Recommended improvements

## Switching to Supabase Later

To move from local storage to Supabase:

1. Create tables for profiles, roadmap tasks, activities, vault items, exams, opportunities, and saved universities.
2. Add Supabase authentication.
3. Store each student's data under their authenticated user id.
4. Replace the functions in `lib/storage.ts` with Supabase queries.
5. Keep the TypeScript types in `lib/types.ts` as the shared contract between UI, scoring, roadmap generation, and database code.

## Future Improvements

- Real university data integrations
- Common Data Set ingestion
- College Scorecard API integration
- UCAS course data integration
- Counselor dashboard
- Parent dashboard
- Deadline notification system
- AI opportunity search
- Essay review system with ethics guardrails
- Scholarship matching
- Recommendation letter tracker
- Public student portfolio export

## Project Positioning

Admitify is designed to help students build real achievements and stronger habits over time.

It should be used as a planning assistant, not as an admissions predictor. The product encourages honest work, measurable impact, clear proof, and realistic next steps.
