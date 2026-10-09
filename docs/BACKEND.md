# Backend setup and operational boundaries

1. Create a Supabase project. Apply `supabase/migrations/001_initial.sql` and then `supabase/migrations/002_preferences.sql` with the SQL editor or Supabase CLI. These migrations assume Supabase Auth/Storage schemas.
2. Copy `.env.example` to `.env.local`. Configure the project URL, anon key and server-only service role key. Set `NEXT_PUBLIC_SITE_URL` to the canonical application origin; production requires HTTPS.
3. Enable email confirmation and optionally Google OAuth in Supabase. Set the Site URL and allowed callback URL to `https://your-domain/auth/callback`. Configure a transactional email provider. Recovery links use `/auth/callback?next=/reset-password`.
4. Create four Stripe recurring prices and configure their IDs. Subscribe a signed webhook endpoint at `/api/webhooks/stripe` to `customer.subscription.created`, `.updated`, and `.deleted`. Enable the Stripe Customer Portal with cancellation and payment-method management. Test in Stripe test mode before activating billing.
   Keep `PAID_PLANS_READY=false` until paid content, account sync, support details, billing, and legal terms are complete. Set it to `true` only after the final commercial launch checks.
5. Set an OpenAI key and a Responses-compatible model in `OPENAI_MODEL`. Coach requests require an active Premium subscription and use only the authenticated user's recent persisted score metrics. Transcription text and personal names are not sent to OpenAI.
6. Deploy Next.js to Vercel and configure the same environment variables in the deployment environment. Redeploy when public variables change. Enable database backups, monitoring and email delivery monitoring before launch.

## Security and data model

Every application table has RLS enabled. Profile role/suspension fields, subscription state, scores and achievement awards cannot be written by the browser. APIs validate the authenticated account with `auth.getUser`, enforce suspension and origin checks for mutations, validate bodies with Zod and use an atomic PostgreSQL rate limiter. Rate protection fails closed if unavailable. The service-role key must never enter client code. Assign an administrator with a privileged SQL operation: `update public.profiles set role='admin' where id='YOUR-UUID';`.

`POST /api/attempts` accepts `{dictationId, typedText, elapsedSeconds, backspaces}` and calculates scores from the database transcript using the same scoring engine as the browser. Attempts and mistake rows save in one database transaction. The elapsed time is client supplied, so these are **practice scores, not cheat-resistant ranked scores**. The leaderboard view only includes attempts explicitly marked verified by a trusted future proctored timing service, and RLS prevents sharing another learner's raw attempts. Do not weaken that boundary to populate sample rankings.

Payment signatures are verified before processing. Subscription state is read from Stripe before persisting and event IDs are applied transactionally to prevent duplicate handling. Entitlements require an active/trialing subscription and unexpired period. Active subscribers are directed to the Customer Portal instead of opening a duplicate checkout. Invoice event ingestion and receipt history still require implementation.

Uploads go to a private bucket with a 25 MB server-enforced limit, MIME allowlist and owner-scoped paths. MIME declarations are not malware detection. Add content scanning and file signature validation before publishing externally supplied PDFs/audio; keep upload content private until moderation. The signed-upload endpoint accepts metadata and returns a signed upload URL; file bytes go directly to storage. Public/premium content delivery needs an authorized signed-download route when content is curated.

Demo/local practice remains on-device until an authenticated database dictation UUID is used. Authentication, billing, uploads and AI fail visibly with 503 when configuration is absent; they do not simulate external success. The initial migration intentionally has no fabricated learner records, testimonials, statistics or leaderboard data.

## API contract

| Route | Methods | Purpose |
| --- | --- | --- |
| `/api/profile` | GET, PATCH | Account preferences; only editable fields accepted |
| `/api/preferences` | GET, PUT | Favorites, folder labels and completed lesson IDs; no passage or typed text |
| `/login` | page | Email signup/sign-in, optional Google OAuth, and recovery email |
| `/auth/callback` | GET | Exchange Supabase code for cookie session; safe relative redirect |
| `/reset-password` | page | Update password after recovery link |
| `/api/subscription` | GET | Current account plan and expiry |
| `/api/plans` | GET | Public, live Stripe unit prices in minor currency units |
| `/api/billing-portal` | POST | Authenticated Stripe Customer Portal URL |
| `/api/attempts?page=0` | GET, POST | Paginated history and server-scored submission |
| `/api/content?q=&page=0` | GET, POST | RLS-filtered library and private custom transcripts |
| `/api/uploads` | POST | `{contentType,size}` to signed private upload |
| `/api/checkout` | POST | `{plan: 'pro' or 'premium', interval: 'month' or 'year'}` |
| `/api/coach` | POST | `{message}`; Premium, 10 requests/hour |
| `/api/admin?userPage=0&dictationPage=0&q=` | GET, POST | Paginated account/content inspection (20 per page); suspend accounts and create, edit, or publish curated dictations |
| `/api/webhooks/stripe` | POST | Raw-body signed Stripe subscription events |

Run integration verification against an isolated Supabase project: two separate learners must not read/update one another's profiles, attempts or storage; learners must not update role or subscription; expired Pro must not read premium transcripts; unsigned Stripe events must return 400; repeated event IDs must have no effect; suspended accounts must receive 403. External integration tests need actual project credentials and are not claimed to have run locally.
