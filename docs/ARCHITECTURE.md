# StenoFlow architecture

## Product map

The public site has a landing page, pricing page, legal/about pages, and eight exam and typing guides. The signed-in workspace is organized around four journeys:

1. **Prepare:** profile goals, lessons, study plan, and exam practice presets.
2. **Practice:** searchable original dictations, browser voice playback, timer, transcription, custom text passages, and folders.
3. **Review:** word alignment, error categories, drills, spelling cards, history, charts, streaks, and achievements.
4. **Manage:** account authentication, optional paid subscriptions, private uploads, administrator APIs, and grounded coaching once services are configured.

The navigation maps these journeys onto a small number of product sections rather than separate disconnected microsites.

## Design system

Base layout primitives live in `src/app/globals.css`. The current design tokens and public-page typography are in `src/app/design-system.css`; `src/app/home.css` contains the scoped editorial landing page. `src/app/workspace-design.css` refines the application shell and feature surfaces, including dark mode and responsive layouts. Warm paper surfaces, moss accents, serif headings, and readable system UI typography create a consistent visual hierarchy. Practice and learning component styles remain scoped to their feature folders.

## Data boundaries

- The immediate practice experience is local first. `src/lib/store.ts` persists attempts, saved passages, folders, favorites, notifications, and lesson completion in browser storage; local audio is held in IndexedDB. Signed-in profile fields can sync to Supabase, while guest and signed-in browser stores have separate namespaces. Nothing in the local store is a shared leaderboard result.
- `src/lib/scoring.ts` is imported by both the browser practice screen and the authenticated attempts API. The server recalculates scores from the database's own source passage before saving an attempt.
- `supabase/migrations/001_initial.sql` defines relational records, indexes, row level security, storage access, rate limiting, and atomic attempt/webhook functions. It is not applied until a Supabase project is connected.
- Server endpoints live under `src/app/api`. Service role, payment, and AI credentials are server only. Auth, premium access, administrator actions, and billing are checked on the server.
- Coach recommendations in the local workspace use explicit rules and measured local attempts. The optional OpenAI endpoint uses only recent persisted score summaries and requires an authenticated Premium account.

## Current capability status

| Capability | Current behavior |
| --- | --- |
| Landing, guides, responsive workspace, light/dark preference | Functional locally |
| Original passages, local audio or browser voice, timer, typing, results, mistake analysis, exam phases | Functional locally; browser voice pace is approximate |
| Lessons, drills, flashcards, custom passages, folders, analytics, PDF guides, reminders | Functional locally with device storage; reminders run while the app is open |
| Authentication and email recovery | Implemented against Supabase; requires project credentials and provider setup |
| Cloud attempts and shared rankings | Server foundations exist; the local practice flow is not connected to cloud submissions and rankings need trusted timing |
| Paid plans and AI Coach | Protected server endpoints exist; checkout remains gated until benefits, legal terms, and integration tests are ready |
| Administrator controls | Protected API and interface exist; require a configured administrator account |

## Scale and launch work

The code splits feature surfaces by route and keeps scoring independent of React, allowing the server to validate results. The library source can be replaced by paginated database content without changing the practice component's scoring contract. Before a public launch, connect the Supabase project, load and review owned content, configure OAuth/email and Stripe, create a signed delivery path for premium files, verify multi-user security, add content moderation and cloud account export/deletion, and publish complete operator legal terms. A trusted exam timer is required before ranking attempts across learners.

