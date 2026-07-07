# 🚀 FlowPilot AI

**FlowPilot AI** is a production-ready Next.js MVP built for the **TakeOver'26 Theme 2** challenge — an AI-powered workflow command center that turns plain-language requests into routed approvals, activity logs, and executive analytics.

🔗 **Live Demo:** [flow-pilot-ai-xi.vercel.app](https://flow-pilot-ai-xi.vercel.app/)

---

## 🎥 Demo Video

[![Watch the Demo](https://img.shields.io/badge/▶-Watch%20Demo%20Video-red?style=for-the-badge)](https://drive.google.com/file/d/1EQYiBinLBcbjGfjOYkGeVSwNhKxqJDSR/view?usp=sharing)

---

## ✨ What It Includes

- 🏠 Landing page with hero, feature cards, architecture flow, and CTA
- 📊 Dashboard with KPI cards, recent activity, Recharts visualizations, and live metrics
- 💬 ChatGPT-style AI workflow intake powered by Google Gemini with deterministic fallback
- ⚙️ Workflow engine that extracts request metadata, assigns approvers, persists requests, and logs activity
- 🔍 Searchable request table
- ✅ Manager approval workspace with comments, approve, and reject actions
- 📈 Analytics for departments, approval rate, pending vs completed, and trends
- 🔧 Settings for Gemini API key, profile, and theme switching
- 🗄️ Supabase schema, seed data, API routes, loading states, error handling, and toast notifications

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui-style components |
| Database | Supabase |
| AI | Google Gemini API |
| Charts | Recharts |
| Icons | Lucide Icons |
| Notifications | Sonner |

## 📂 Key Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/dashboard` | KPI command center |
| `/chat` | AI workflow intake |
| `/requests` | Searchable request registry |
| `/approvals` | Manager decision page |
| `/analytics` | Workflow analytics |
| `/settings` | API key, profile, and theme |

## 🔌 API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Returns metrics, chart data, activity, and requests |
| `GET` | `/api/workflows` | Returns workflow requests |
| `POST` | `/api/workflows` | Extracts, creates, routes, saves, and logs a workflow |
| `PATCH` | `/api/workflows/:id` | Approves or rejects a workflow and logs the decision |
| `POST` | `/api/extract` | Returns only Gemini extraction JSON |

## 🚦 Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Create environment variables**

```bash
cp .env.example .env.local
```

3. **Fill in `.env.local`**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
```

4. **Set up Supabase tables**

Run `supabase/schema.sql` in the Supabase SQL editor, then run `supabase/seed.sql` for sample data.

5. **Start the app**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🧪 Demo Mode

The app works **without** Supabase or Gemini keys:

- Without Supabase → uses built-in sample workflows for a smooth hackathon demo
- Without Gemini → uses a deterministic extractor that maps request text to department, type, priority, approver, and summary

For a full production-like demo, configure Supabase and Gemini in `.env.local`. A browser-specific Gemini key can also be saved on the Settings page.

## 💡 Sample Prompt

```text
I need leave tomorrow because of fever.
```

**Expected structured output:**

```json
{
  "requestType": "Leave Request",
  "department": "Human Resources",
  "priority": "medium",
  "requiredApprover": "Meera Iyer",
  "summary": "I need leave tomorrow because of fever."
}
```

## 📁 Folder Structure

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

---

## 👤 Author

Built by **Ashwin K** — [GitHub](https://github.com/imashwin-max)
