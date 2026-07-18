# 🚀 FlowPilot AI — AI-Powered Workflow Command Center

**FlowPilot AI** is a production-ready Next.js application built for the **TakeOver'26 Theme 2** challenge. It transforms plain-language business requests into routed approvals, team capacity simulations, audit logs, and executive analytics.

🔗 **Live Demo:** [flow-pilot-ai-zeta.vercel.app/](https://flow-pilot-ai-zeta.vercel.app/)

---

## 🎥 Demo Video

[![Watch the Demo](https://img.shields.io/badge/▶-Watch%20Demo%20Video-red?style=for-the-badge)](https://drive.google.com/drive/folders/1g6uqUeOiF1MkjZdIYEOJyiwnTJiQqwR2?usp=sharing)

---

## ✨ Features & Architecture Highlights

### 🎨 Minimalist Charcoal Theme & Glassmorphism
- Replaced standard templates with a premium charcoal dark/light color palette.
- Styled with a custom dot-mesh background overlay and radial accent glows.
- Configured glassmorphic sidebars and header navigation blocks in [app-shell.tsx](file:///Users/Ashwin/FlowPilot-AI/components/app-shell.tsx).

### 💬 AI-Driven Intake Console
- ChatGPT-style conversational input powered by **Google Gemini** to parse free-text requests.
- Deterministic regex fallback parser for environments where the Gemini key is not configured.
- Extracts request type, department, severity, coverage backups, and required approvers instantly.

### 🛡️ Hybrid Authentication (Clerk + Custom Mock Session)
- **Clerk Integration:** Production-ready authentication wrapping the app in a `<ClerkProvider>`.
- **Clerk-less Fallback Demo Mode:** If Clerk environment variables are not configured:
  - Custom [sign-in](file:///Users/Ashwin/FlowPilot-AI/app/sign-in/[[...sign-in]]/page.tsx) and [sign-up](file:///Users/Ashwin/FlowPilot-AI/app/sign-up/[[...sign-up]]/page.tsx) screens render a mock selector.
  - Users can sign in as a **Demo Manager** or **Demo Employee** (persisted via cookies).
  - Avatar initials (`DM` / `DE`) toggle a dropdown menu to **Switch Roles** or **Sign Out**.
  - Restricts unauthorized routes (e.g. employee roles cannot approve workflows).

### 👥 AI Team Capacity Impact Simulator
- A modular simulator ([impact-simulator.tsx](file:///Users/Ashwin/FlowPilot-AI/components/impact-simulator.tsx)) that dynamically models request risk.
- Displays capacity bar charts, team workloads, overlapping schedules, and color-coded risk alerts.
- Integrates in both standalone routes and nested Admin panels.

### 🔒 Secure Admin Panel
- Access-protected with a demo password credential (`Admin@FlowPilot`).
- Resets login/session states instantly on reload, navigating to other pages, switching browser tabs, or window blur events.
- Smart state persistence prevents password prompts when switching inner sub-tabs.

---

## 📁 Folder Structure

```text
├── app/                      # Next.js App Router Pages & API endpoints
│   ├── admin/                # Admin Panel with password protection & unmount state resets
│   ├── analytics/            # Recharts analytics page
│   ├── api/                  # API endpoints (dashboard metrics, workflows CRUD, Gemini parser)
│   ├── approvals/            # Manager approval board (lists, reviews, approves, rejects)
│   ├── chat/                 # AI Intake Chat component interface
│   ├── dashboard/            # Executive command center with metrics grid and charts
│   ├── impact-simulator/     # Standalone Team Impact Simulator page wrapper
│   ├── requests/             # Unified workflow request registry
│   ├── settings/             # System settings, Gemini API keys, profile settings
│   ├── sign-in/ & sign-up/   # Clerk authentication screens with custom mock fallbacks
│   ├── layout.tsx            # Global layout with conditional ClerkProvider wrap
│   └── page.tsx              # Redesigned minimalist landing page
├── components/               # Reusable React components
│   ├── ui/                   # Shared UI primitives (Card, Button, Dialog, etc.)
│   ├── app-shell.tsx         # Responsive glassmorphic sidebar and navigation header
│   ├── charts.tsx            # Analytics components powered by Recharts
│   └── impact-simulator.tsx  # Modular Team Capacity Impact Simulator client-side simulator
├── lib/                      # Helper libraries and business logic
│   ├── impact-analyzer.ts    # Mathematical capacity modeling logic
│   ├── server-guards.ts      # Rate limiter, safe error wrapper, and manager auth assert functions
│   └── workflows.ts          # Core workflows database interaction & Gemini extraction
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Authentication** | Clerk (Production) / Custom Session Cookies (Bypass Mode) |
| **Database** | Supabase |
| **AI Processing** | Google Gemini API (Fallback to regex parsing) |
| **Data Viz** | Recharts |
| **Components** | Radix UI primitives |

---

## 🔌 API Registry

| Method | Endpoint | Access Control | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | Public / Role Check | Retrieves dashboard metrics, KPI counters, and chart datasets |
| `GET` | `/api/workflows` | Public / Role Check | Returns a list of workflow requests (optionally filtered by requester name) |
| `POST` | `/api/workflows` | Authenticated | Parses, routes, and logs a natural language business request |
| `PATCH` | `/api/workflows/:id` | Manager Only | Approves or rejects a workflow request and writes a review audit log |

---

## 🚦 Getting Started

### 1. Installation
Clone the repository and install npm packages:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file from the example template:
```bash
cp .env.example .env.local
```

Fill in the keys:
```env
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Configuration (Gemini)
GEMINI_API_KEY=your-google-gemini-api-key

# Clerk Authentication (Optional)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

### 3. Database Initialization
Run the contents of [supabase/schema.sql](file:///Users/Ashwin/FlowPilot-AI/supabase/schema.sql) in the Supabase SQL editor to bootstrap tables, and [supabase/seed.sql](file:///Users/Ashwin/FlowPilot-AI/supabase/seed.sql) to add sample records.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to preview.

---

## 🧪 Demo Mode Fallbacks
FlowPilot AI is engineered to be **zero-config friendly** for hackathon juries and reviewers. If external variables are absent:
- **No Supabase:** The system automatically uses local memory storage and mocks CRUD operations seamlessly.
- **No Gemini API Key:** The system falls back to a deterministic parsing engine which maps leave duration, keywords, and priority types to structural objects.
- **No Clerk Keys:** The custom mock authentication system activates automatically, allowing full sign-in/sign-out simulations and manager/employee permission locks.

---

## 👤 Author

Built by **Ashwin K** — [GitHub](https://github.com/imashwin-max)
