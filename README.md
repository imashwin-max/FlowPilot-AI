<div align="center">

# 🚀 FlowPilot AI

**AI-Powered Workflow Command Center — From Natural Language to Routed Execution**

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)](https://flow-pilot-ai-zeta.vercel.app/)

[Live Application](https://flow-pilot-ai-zeta.vercel.app/) · [Report Bug](https://github.com/imashwin-max/FlowPilot-AI/issues) · [Submit Request](https://github.com/imashwin-max/FlowPilot-AI/issues)

</div>

---

## 📖 Overview

**FlowPilot AI** is an enterprise workflow command center developed for the **TakeOver'26 Theme 2** challenge. Built on Next.js 15 and powered by Google Gemini, the platform converts unstructured business communications (PTO, equipment requisitions, budget adjustments, project sign-offs) into structured records, automated approval routing, team capacity simulations, and real-time executive analytics.

Engineered with hackathon resilience and production readiness in mind, FlowPilot AI provides zero-configuration fallbacks across all critical integration points (Database, Authentication, and AI engines).

---

## ✨ Key Features

### 💬 Conversational Intake & Ambiguity Handling
- **Gemini NLP Parsing:** Extracts department, urgency, coverage requirements, and specific approver hierarchies from raw text.
- **Clarification Dialogues:** Detects ambiguous or underspecified inputs and prompts the user for missing details before triggering approval pipelines.
- **Deterministic Regex Fallback:** Ensures continuous parsing capabilities when API keys or network routes are unavailable.

### 👥 Capacity Impact Simulation (`impact-simulator.tsx`)
- Dynamic mathematical modeling quantifying how approved requests affect department bandwidth.
- Interactive capacity charts, overlap alerts, and color-coded risk flags to prevent project bottlenecks.
- Integrated across individual employee requests and executive manager panels.

### 🛡️ Hybrid Authentication & Mock Role Architecture
- **Clerk Production Mode:** Full identity federation via `<ClerkProvider>` and conditional edge middleware.
- **Zero-Config Demo Mode:** Fallback authentication when external credentials are absent. Switch seamlessly between:
  - **Demo Manager (`DM`):** Access to approval queues, audit trails, and team simulators.
  - **Demo Employee (`DE`):** Standard request intake, personal history, and status tracking.
- Session persistence handled through encrypted cookie stores.

### 🔒 Ephemeral Admin Command Panel (`/admin`)
- Gated behind secure administrative access (`Admin@FlowPilot`).
- Automatic session revocation on tab switches, window blur events, or page reloads to prevent credential leakage.
- Sub-tab persistence preserves state across internal configuration changes.

### 📊 Executive Metrics & Analytics
- Live KPI monitoring via Recharts covering throughput, pending backlogs, approval rates, and department velocity.
- Comprehensive immutable audit logging across all state transitions.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server components, API routes, and edge runtime |
| **Language** | TypeScript | Strict static typing across schemas and API responses |
| **Styling** | Tailwind CSS + Radix UI | Charcoal glassmorphism theme and accessible primitives |
| **AI Intelligence** | Google Gemini API | Natural language extraction and structured JSON normalization |
| **Database** | Supabase (PostgreSQL) | Workflow states, audit registries, and team profiles |
| **Authentication** | Clerk / Mock Cookie Engine | Hybrid session verification and role enforcement |
| **Visualization** | Recharts | Interactive workload, risk, and analytics graphs |

---

## 🎨 Theme & Design System

The platform replaces generic dashboard layouts with a bespoke minimalist charcoal visual system:
- **Palette:** Matte obsidian, charcoal surfaces (`#18181B`), and muted slate borders.
- **Glassmorphism:** Radial accent backdrops and blur-filtered navigation layers.
- **Grid Dynamics:** Custom dot-mesh overlays for modern SaaS aesthetics.

---

## 📁 Repository Structure

```text
FlowPilot-AI/
├── app/
│   ├── admin/                # Gated admin management with auto-blur state reset
│   ├── analytics/            # Recharts
