# FlowPilot AI

FlowPilot AI is a production-ready Next.js MVP for the TakeOver'26 Theme 2 challenge: intelligent systems that automatically execute multi-step workflows across departments and approvals.

## What It Includes

- Landing page with hero, feature cards, architecture flow, and CTA
- Dashboard with KPI cards, recent activity, Recharts visualizations, and live metrics
- ChatGPT-style AI workflow intake powered by Google Gemini with deterministic fallback
- Workflow engine that extracts request metadata, assigns approvers, persists requests, and logs activity
- Searchable request table
- Manager approval workspace with comments, approve, and reject actions
- Analytics for departments, approval rate, pending vs completed, and trends
- Settings for Gemini API key, profile, and theme switching
- Supabase schema, seed data, API routes, loading states, error handling, and toast notifications

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Supabase
- Google Gemini API
- Recharts
- Lucide Icons
- Sonner toasts

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment variables:

```bash
cp .env.example .env.local
```

3. Fill `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
```

4. Create Supabase tables:

Run `supabase/schema.sql` in the Supabase SQL editor, then run `supabase/seed.sql` for sample data.

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Mode

The app works without Supabase or Gemini keys. Without Supabase, it uses built-in sample workflows for a smooth hackathon demo. Without Gemini, it uses a deterministic extractor that maps request text to department, type, priority, approver, and summary.

For a full production-like demo, configure Supabase and Gemini in `.env.local`. A browser-specific Gemini key can also be saved on the Settings page.

## Key Routes

- `/` landing page
- `/dashboard` KPI command center
- `/chat` AI workflow intake
- `/requests` searchable request registry
- `/approvals` manager decision page
- `/analytics` workflow analytics
- `/settings` API key, profile, and theme

## API Routes

- `GET /api/dashboard` returns metrics, chart data, activity, and requests
- `GET /api/workflows` returns workflow requests
- `POST /api/workflows` extracts, creates, routes, saves, and logs a workflow
- `PATCH /api/workflows/:id` approves or rejects a workflow and logs the decision
- `POST /api/extract` returns only Gemini extraction JSON

## Folder Structure

```text
app/
  api/
  analytics/
  approvals/
  chat/
  dashboard/
  requests/
  settings/
components/
  ui/
lib/
supabase/
```

## Sample Prompt

```text
I need leave tomorrow because of fever.
```

Expected structured output:

```json
{
  "requestType": "Leave Request",
  "department": "Human Resources",
  "priority": "medium",
  "requiredApprover": "Meera Iyer",
  "summary": "I need leave tomorrow because of fever."
}
```
