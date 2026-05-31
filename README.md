# Admitify

Admitify is an AI-powered portfolio operating system that helps students turn dream university goals into a concrete academic, extracurricular, exam, project, and proof roadmap.

The MVP is intentionally ethical: it focuses on Dream Fit Readiness Score, profile strength, gap analysis, roadmaps, and verifiable achievements. It does not make guaranteed outcome claims.

## Quick Start

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

The default dev and build scripts use Webpack plus the installed SWC WASM fallback for this macOS workspace. If your machine has native Next/SWC working normally and you want Turbopack, run:

```bash
npm run dev:turbo
```

## Secure OpenAI Setup

`.env.local` is already created locally and ignored by Git. Add your real key there when ready:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5
OPENAI_REASONING_EFFORT=minimal

AI_OPENAI_ENABLED=true
AI_DAILY_REQUEST_LIMIT=20
AI_DAILY_REQUEST_LIMIT_PER_CLIENT=3
AI_MIN_SECONDS_BETWEEN_REQUESTS=30
AI_MAX_CONTEXT_CHARS=12000
AI_MAX_OUTPUT_TOKENS=700
```

Do not put the key in `.env.example`, source code, screenshots, or the README. `.gitignore` ignores `.env*` and explicitly allows only `.env.example`.

Set `AI_OPENAI_ENABLED=false` for zero-credit demo mode. If `OPENAI_API_KEY` is missing, an API call fails, or quota is reached, Admitify returns deterministic fallback guidance so the demo still works.

Usage limits are enforced server-side in `lib/ai/usage-limit.ts` before any OpenAI call:

- Demo-wide daily limit
- Per-visitor daily limit
- Cooldown between requests
- Context truncation
- Output token cap

## Demo Flow

First launch opens a short interactive tour. Judges can:

- Use the demo profile if they are not a student
- Start onboarding if they want to enter their own profile
- Explore the dashboard, roadmap, dream schools, activities, proof vault, and AI coach

To show the tour again, clear local storage for the site or remove `admitify.tour.seen`.

## Included MVP Features

- App-first home route at `/` that opens the student workspace
- First-run interactive tour with one-click demo profile
- Multi-step onboarding at `/onboarding`
- Calm dashboard with Dream Fit Readiness Score, next best move, focus modes, three weekly actions, target schools, and weakest areas
- Dream university explorer with 70+ editable sample universities, visual logos, quick country chips, advanced filters, and progressive loading
- Deterministic roadmap action board with one active timeframe, task completion, priorities, hours, deadlines, and evidence prompts
- Extracurricular planner with a master-detail editor, depth scores, warnings, and improvement suggestions
- Portfolio Vault with a master-detail proof editor and proof strength scoring
- AI Coach chat with secure API route, quota limits, cooldown UI, and mock fallback
- Settings page for profile basics, targets, weekly hours, and application year
- Supporting pages for profile strength, exams, and opportunities remain available by direct route for demo depth

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- Framer Motion
- Recharts
- Local JSON seed data
- localStorage persistence through a replaceable storage abstraction
- Optional OpenAI Responses API route

## Data and Scoring

Seed data lives in:

- `lib/seed/universities.ts`
- `lib/seed/exams.ts`
- `lib/seed/opportunities.ts`
- `lib/seed/sampleProfile.ts`

Scoring lives in:

- `lib/scoring.ts`

Roadmap generation lives in:

- `lib/roadmap.ts`

Storage lives in:

- `lib/storage.ts`

The scoring engine is deterministic and explainable. Overall readiness uses:

- Academics: 25
- Tests: 15
- Extracurricular depth: 20
- Awards: 10
- Projects and proof: 15
- Leadership: 10
- Narrative fit: 5

## Switching From localStorage to Supabase Later

The MVP keeps persistence behind `lib/storage.ts`. To add Supabase:

1. Create Supabase tables for `profiles`, `roadmap_tasks`, `vault_items`, `activities`, `exam_plans`, and `saved_opportunities`.
2. Replace `loadProfile`, `saveProfile`, `loadRoadmap`, and `saveRoadmap` with async Supabase calls.
3. Add authentication and map the authenticated user id to `StudentProfile.id`.
4. Move the `useProfile` hook to fetch from Supabase on session load.
5. Keep the TypeScript models in `lib/types.ts` as the contract between UI, scoring, roadmap, and database.

## Future Improvements

- Real university data integrations
- Common Data Set ingestion
- College Scorecard API integration
- UCAS course data integration
- Counselor dashboard
- Parent dashboard
- Deadline notification system
- AI opportunity search
- Essay review system
- Scholarship matching
- Recommendation letter tracker
- Public student portfolio export
