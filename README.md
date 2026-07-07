# 🚀 FlowPilot AI

**FlowPilot AI** is a production-ready Next.js MVP built for the **TakeOver'26 Theme 2** challenge — an AI-powered workflow command center that turns plain-language requests into routed approvals, activity logs, and executive analytics.

🔗 **Live Demo:** [flow-pilot-ai-xi.vercel.app](https://flow-pilot-ai-xi.vercel.app/)

---

## 🎥 Demo Video

https://github.com/imashwin-max/FlowPilot-AI/assets/demo/flowpilot-demo.mp4

> 📌 See the [Uploading the Demo Video](#-uploading-the-demo-video) section below for how to add this so it plays inline on GitHub.

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

## 📎 Uploading the Demo Video

GitHub doesn't let you upload video files directly through the file browser UI, but here's the easiest way to get it hosted and playable inline in your README:

1. Go to your repo → open any **Issue** (or create a new one) or a **Discussion**
2. **Drag and drop your local video file** into the comment text box
3. GitHub will upload it and auto-generate a link like:
   ```
   https://github.com/imashwin-max/FlowPilot-AI/assets/.../demo.mp4
   ```
4. Copy that link and replace the placeholder link at the top of this README under **🎥 Demo Video**
5. You can close the issue afterward without submitting it — the uploaded file link stays active either way

Once replaced, GitHub will render it as an inline playable video on your repo page.

---

## 👤 Author

Built by **Ashwin K** — [GitHub](https://github.com/imashwin-max)
