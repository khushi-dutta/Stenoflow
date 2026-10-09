# StenoFlow

A Next.js/React/TypeScript stenography and typing practice platform with an original design, responsive learning workspace, measured analytics, and server integrations prepared for Supabase, Stripe, and OpenAI.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The free practice flow works immediately and stores progress on this device. Run `npm test`, `npm run typecheck`, and `npm run build` before release.

## Platform structure

- `src/app/page.tsx`: public landing page
- `src/app/app/[section]/page.tsx`: product workspace routes
- `src/features/practice`: timed typing and dictation workspace, recorded/local audio player, exam phases, and results
- `src/features/learning`: lessons, mistakes, drills, profile, folders, exams, original PDF resources, and coach
- `src/lib/scoring.ts`: shared bounded scoring engine
- `src/lib/store.ts`: local first progress and preferences
- `src/app/api`: authenticated server endpoints
- `supabase/migrations`: relational schema and row level security

## Connected services

See [docs/BACKEND.md](docs/BACKEND.md) and [.env.example](.env.example) for Supabase, Stripe, OpenAI, and Vercel setup. Never put service role, payment, or AI keys in variables prefixed `NEXT_PUBLIC_`. External services return an explicit unavailable response until configured. Browser voice synthesis provides listening practice when recorded audio is not supplied; its pacing depends on the browser and is not a calibrated shorthand recording.

## What is ready

The local workspace includes English/Hindi typing, original dictations, transcription scoring, exam presets, mistake review, drills, progress charts, custom passages and local audio, folders, printable PDF guides, study reminders, and a practice-based readiness indicator. Profile settings and practice data are kept on this device. Supabase login and profile sync can be enabled with a project; the service-backed admin, billing, upload, and AI endpoints require their respective credentials.

The app deliberately does not display invented community rankings. Timed browser practice is not proctored or cheat-resistant. Cloud upload of raw transcriptions and personal preferences is not wired into the local flow. Paid checkout stays disabled while `PAID_PLANS_READY=false`.

Before a public paid launch, complete provider configuration, verified content uploads/downloads, subscription cancellation management, operator legal terms and support contact, and multi-account integration testing. See [docs/BACKEND.md](docs/BACKEND.md).
