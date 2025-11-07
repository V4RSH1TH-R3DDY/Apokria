# Apokria — Where Every Campus Event Finds Its Perfect Flow

Apokria is a multi-agent AI event orchestrator purpose-built for colleges and universities. It keeps campus calendars conflict-free, crafts bespoke event flows, generates sponsor outreach, and equips organizers with intelligence to run memorable experiences in under 24 hours of build time.

## 🚀 Current Project Status

### Completed ✅
- **Phase 1**: Project setup, architecture design, and repository structure
- **Sub-Phase 2.1**: SchedulerAgent with real-time conflict detection and Firebase integration  
- **Sub-Phase 2.2**: FlowAgent with Google Gemini AI for intelligent event itinerary generation
- **Sub-Phase 2.3**: SponsorAgent with intelligent matching and LLM-powered outreach email generation
- **Frontend**: React/Vite dashboard with event creation, conflict detection, and flow generation UI
- **Backend**: FastAPI server with complete API endpoints for all three core agents

### In Progress 🔄  
- **Phase 3**: Frontend-backend integration and UI refinement
- **Content Agent**: AI-powered content generation for event materials
- **Analytics Agent**: Event performance tracking and insights

### Upcoming ⏳
- **Phase 4**: Analytics dashboard and testing framework  
- **Phase 5**: Demo video and pitch deck preparation

## 🏃‍♂️ Quick Start (Current Implementation)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```

### Test Current Features
- **Conflict Detection**: `GET http://localhost:8000/check_conflict?start_time=2024-12-01T10:00:00&end_time=2024-12-01T12:00:00`
- **Event Flow Generation**: `GET http://localhost:8000/generate_flow?event_name=Tech Conference&event_type=academic_conference&duration=4`
- **Sponsor Recommendations**: `GET http://localhost:8000/get_sponsors?event_type=academic_conference&budget_range=Medium`

---

## Contents

- [Problem Statement](#problem-statement)
- [Solution Snapshot](#solution-snapshot)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Blueprint](#repository-blueprint)
- [Data & AI Assets](#data--ai-assets)
- [Environment Setup](#environment-setup)
- [24-Hour Hackathon Playbook](#24-hour-hackathon-playbook)
  - [Phase 1 · Ideation & Setup (0–3 hrs)](#phase-1--ideation--setup-03-hrs)
  - [Phase 2 · Core Agent Development (3–10 hrs)](#phase-2--core-agent-development-3-10-hrs)
  - [Phase 3 · Integration & Frontend (10–16 hrs)](#phase-3--integration--frontend-10-16-hrs)
  - [Phase 4 · Testing & Analytics (16–20 hrs)](#phase-4--testing--analytics-16-20-hrs)
  - [Phase 5 · Pitch, Demo & Polish (20–24 hrs)](#phase-5--pitch-demo--polish-20-24-hrs)
- [Agent Deep Dive](#agent-deep-dive)
- [Integration & Collaboration Guide](#integration--collaboration-guide)
- [Testing & Quality Gates](#testing--quality-gates)
- [Submission Checklist](#submission-checklist)
- [Future Scope](#future-scope)

---

## Problem Statement

Campus event management is notoriously chaotic:

- Overlapping schedules and double-booked venues
- Fragmented communication between clubs, departments, and coordinators
- Manual logistics tracking for materials, sponsors, and volunteers
- Lack of cohesive branding and timely content production
- Minimal insights into performance, participation, and ROI

Organizers need an AI-first workflow that coordinates planning, scheduling, content creation, logistics, and sponsorship outreach—without adding overhead.

## Solution Snapshot

Apokria deploys specialized autonomous agents that co-own the entire event lifecycle:

- **Smart scheduling** keeps the campus calendar conflict-free
- **Dynamic event flow generation** tailors agendas by type, duration, and budget
- **Localized sponsor matching** increases outreach efficiency and revenue
- **Automated content production** ensures branded collateral is always on time
- **Analytics insights** monitor engagement, resource usage, and post-event success

All agents communicate via a lightweight coordination layer that pushes updates to the central dashboard, guaranteeing real-time visibility and zero redundancies.

## System Architecture

### Multi-Agent Roster

| Agent | Core Responsibility | Key Outputs |
| --- | --- | --- |
| 🗓️ **Scheduler Agent** | Maintain a clash-free calendar, detect overlaps, and recommend alternate slots. | Suggested schedules, availability matrix, conflict alerts |
| 🧩 **Flow Agent** | Design end-to-end event itineraries based on event type, duration, and constraints. | Session-by-session agenda, buffer slots, staffing cues |
| 🤝 **Sponsor Agent** | Match events with relevant sponsors and auto-generate outreach material. | Ranked sponsor list, contact cards, email pitch drafts |
| 🗃️ **Content Agent** | Produce branded content—emails, invites, posters, certificates. | AI-generated creatives, copy blocks, email sequences |
| 📊 **Analytics Agent** | Track participation, satisfaction, and resource usage across events. | KPI dashboards, actionable insights, post-event summaries |

### Coordination Flow

1. **Event intake** via the frontend form triggers the Scheduler Agent.
2. Confirmed timeslots unlock Flow and Sponsor agents, which work in parallel.
3. Generated itineraries and sponsor decks feed the Content Agent for collateral.
4. All agent outputs sync to the **central orchestration service**, publishing updates to MongoDB/Firebase and the React dashboard.
5. Analytics Agent periodically ingests event data to surface insights and notifications.

## Tech Stack

| Layer | Preferred Tools | Notes |
| --- | --- | --- |
| Frontend | React.js or Next.js | Rapid dashboard prototyping, calendar visualizations |
| Backend | FastAPI or Flask | Agent endpoints, coordination logic, REST API |
| Database | MongoDB Atlas / Firebase | Event metadata, sponsor leads, user auth |
| AI & Orchestration | LangChain, OpenAI / Local LLMs | Prompt templates, agent collaboration |
| Hosting | Vercel (frontend), Render/Replit/HF Spaces (backend) | Continuous demo readiness |

## Repository Blueprint

```
GenAI/
├─ frontend/               # React or Next.js dashboard
├─ backend/                # FastAPI service hosting all agents
│  ├─ agents/
│  │  ├─ scheduler.py
│  │  ├─ flow.py
│  │  ├─ sponsor.py
│  │  ├─ content.py
│  │  └─ analytics.py
│  ├─ data/
│  │  └─ sponsors.csv      # Seed sponsor dataset
│  ├─ models/
│  ├─ routers/
│  └─ core/
├─ docs/
│  ├─ pitch-deck/
│  └─ architecture-diagram.png
├─ scripts/                # Seeding, mock data generators
└─ README.md
```

## Data & AI Assets

- **Sponsor Leads Dataset (`backend/data/sponsors.csv`)**: 30–50 local businesses tagged by category, budget range, and contact info.
- **Prompt Library (`backend/agents/prompts/`)**: Reusable prompt templates for each agent, version-controlled for rapid iteration.
- **Sample Event Seeds (`scripts/seed_events.py`)**: Optional helper to populate calendar with mock data for demos.

## Environment Setup

1. **Clone repository** and create two terminals (frontend + backend).
2. **Backend**
	- Python 3.10+
	- `pip install -r backend/requirements.txt`
	- Configure `.env` with API keys (OpenAI/local LLM), database URI, and frontend URL.
3. **Frontend**
	- `npm install` inside `frontend/`
	- Create `.env.local` for API base URL and analytics configuration.
4. **Run services**
	- Backend: `uvicorn backend.main:app --reload`
	- Frontend: `npm run dev`

> Keep endpoints modular so agents can be demoed via `curl` or Postman if the UI runs behind schedule.

## 24-Hour Hackathon Playbook

### Phase 1 · Ideation & Setup (0–3 hrs) ✅

**Objectives**

- ✅ Align on vision, success metrics, and agent responsibilities.
- ✅ Lock core API contracts and data schemas.
- ✅ Establish repo, branches, and deployment targets.

**Key Tasks**

- ✅ Whiteboard workflow: intake → scheduling → flow → sponsors → content → analytics.
- ✅ Draft OpenAPI spec for `/events`, `/schedule/suggest`, `/flow/generate`, `/sponsors/recommend`, `/content/generate`, `/analytics/summary`.
- ✅ Create wireframes for dashboard: event list, calendar, detail view with agent outputs.
- ✅ Initialize React or Next.js app; bootstrap FastAPI with modular routers.

**Role Focus**

- ✅ *Backend Lead (M1)*: Scaffold FastAPI project structure and define data models.
- ✅ *Frontend Lead (M2)*: Build layout, navigation shell, and placeholder views.
- ✅ *AI Integrator (M3)*: Draft prompt templates and select model providers.
- ✅ *Project Manager (M4)*: Set up task board, integration schedule, and draft pitch outline.

**Deliverables**

- ✅ Repo with base commits, TODO issues, and branching policy.
- ✅ Click-through wireframe (Figma or Miro screenshot).
- ✅ Shared architecture diagram in `docs/`.

### Phase 2 · Core Agent Development (3–10 hrs) ✅

**Objectives**

- ✅ Implement Scheduler, Flow, and Sponsor agents as independent services.
- ✅ Validate each agent via unit tests or mock requests.

**Key Tasks**

- ✅ Scheduler Agent: ingest event payload, check conflicts against DB, return ranked time slots.
- ✅ Flow Agent: map event type + duration to timeline segments and staffing hints.
- ✅ Sponsor Agent: filter sponsors.csv by relevance, generate standardized outreach email.
- ✅ Expose `/agents/<name>` endpoints returning JSON responses ready for UI consumption.
- ✅ Persist events and generated assets in MongoDB/Firebase.

**Role Focus**

- ✅ *M1*: Own Scheduler API, data access layer, and DB migrations.
- ✅ *M3*: Pair with M1 to craft agent prompts and fallback logic.
- ✅ *M2*: Build reusable frontend API hooks and mock data states for integration.
- ✅ *M4*: Document progress, start collecting demo screenshots.

**Deliverables**

- ✅ Passing tests or Postman collections proving each agent works standalone.
- ✅ README snippets documenting endpoint usage.
- ✅ Seeded database with 3–5 sample events.

### Phase 3 · Integration & Frontend (10–16 hrs) 🔄

**Objectives**

- 🔄 Connect backend agents to the dashboard and enable real-time feedback.
- 🔄 Ship an MVP user journey: Create event → view recommendations → confirm plan.

**Key Tasks**

- ✅ Event form with fields: name, department, date range, type, budget, expected audience.
- ✅ Conflict alert banner triggered by Scheduler Agent response.
- ✅ Display Flow Agent itinerary (cards/timeline) and Sponsor Agent suggestions (list with CTA buttons).
- ⏳ Sync generated content previews (emails, poster copy) into a dedicated panel.
- ⏳ Implement optimistic UI with loaders and error states.

**Role Focus**

- ✅ *M2*: Lead UI integration, calendar view, and state management.
- ✅ *M1*: Harden APIs, add CORS, and enable WebSocket or polling for updates.
- ⏳ *M3*: Fine-tune prompts using live event data, ensure content stays on-brand.
- ⏳ *M4*: Validate UX, gather feedback, prepare demo narrative.

**Deliverables**

- ✅ Live (or locally hosted) dashboard showcasing end-to-end flow.
- ⏳ Recorded screen capture of the happy path.
- ✅ Updated README with setup instructions (this document).
- Implement optimistic UI with loaders and error states.

**Role Focus**

- *M2*: Lead UI integration, calendar view, and state management.
- *M1*: Harden APIs, add CORS, and enable WebSocket or polling for updates.
- *M3*: Fine-tune prompts using live event data, ensure content stays on-brand.
- *M4*: Validate UX, gather feedback, prepare demo narrative.

**Deliverables**

- Live (or locally hosted) dashboard showcasing end-to-end flow.
- Recorded screen capture of the happy path.
- Updated README with setup instructions (this document).

### Phase 4 · Testing & Analytics (16–20 hrs) ⏳

**Objectives**

- ⏳ Introduce Analytics Agent and tighten QA across the stack.
- ⏳ Produce actionable insights and notifications.

**Key Tasks**

- ⏳ Analytics Agent: aggregate event KPIs (registrations, sponsor status, resource allocation).
- ⏳ Build `/analytics/summary` endpoint returning charts-ready JSON.
- ⏳ Display stats widget on dashboard + notification center for conflicts or pending sponsor replies.
- ⏳ Run integration tests or manual script verifying critical paths.
- ⏳ Polish logging/monitoring for agent coordination.

**Role Focus**

- ⏳ *M1 & M3*: Implement analytics logic and ensure data integrity.
- ⏳ *M2*: Build analytics UI cards and notification toasts.
- ⏳ *M4*: Coordinate test script, capture metrics for pitch.

**Deliverables**

- ⏳ Analytics dashboard section with at least three KPIs.
- ⏳ Checklist of tested scenarios and bug fixes.
- ⏳ Updated sponsor outreach templates reflecting analytics insights.

### Phase 5 · Pitch, Demo & Polish (20–24 hrs) ⏳

**Objectives**

- ⏳ Package the solution for judges with a compelling narrative.
- ⏳ Ensure the demo is reliable and visually polished.

**Key Tasks**

- ⏳ Finalize 5–6 slide deck covering problem, solution, architecture, demo, future scope.
- ⏳ Record 2-minute walkthrough: event creation → scheduling → flow → sponsors → analytics.
- ⏳ Add light branding (logo, color palette) to UI and generated materials.
- ⏳ Populate submission form with repo link, deck, and video.
- ⏳ Perform final smoke test before judging.

**Role Focus**

- ⏳ *M4*: Own pitch deck, narration, and submission logistics.
- ⏳ *M2*: Ensure UI styling is consistent; capture high-res screenshots.
- ⏳ *M1 & M3*: Stand by for live demo support and Q&A responses.

**Deliverables**

- ⏳ Final deck in `docs/pitch-deck/`.
- ⏳ Demo video link embedded in README.
- ⏳ Clean commit history with tags or release notes.

## Agent Deep Dive

| Agent | Status | Inputs | Processing Highlights | Outputs |
| --- | --- | --- | --- | --- |
| Scheduler | ✅ **Complete** | Event metadata, existing bookings | Time-slot scoring, conflict detection, priority weighting | List of recommended slots, clash report |
| Flow | ✅ **Complete** | Event type, duration, attendee profile, budget tier | Template selection, buffer insertion, speaker/resource cues | Structured agenda JSON + human-readable summary |
| Sponsor | ✅ **Complete** | Event domain, audience size, budget ask | Dataset filtering, lead scoring, email template filling | Ranked sponsor prospects, outreach copy, call-to-action checklist |
| Content | ⏳ **Pending** | Approved agenda, sponsor list, branding tokens | Prompt chaining for copy + image generation hooks | Emails, invites, poster briefs, certificate text |
| Analytics | ⏳ **Pending** | Event lifecycle data, attendance stats, sponsor response logs | KPI computation, trend spotting, anomaly detection | Dashboard widgets, recommendations, follow-up tasks |

## Integration & Collaboration Guide

- **Central Orchestrator**: Maintain an `EventOrchestrator` class that triggers agents, merges responses, and handles fallback strategies.
- **Shared Schemas**: Use Pydantic models to keep payloads consistent across agents and frontend.
- **Versioned Prompts**: Store prompt variants with semantic version tags (e.g., `flow_prompt_v1.1.md`).
- **Communication Cadence**: Daily standups every 4 hours (hackathon speed) + 10-minute sync before each phase transition.
- **Issue Tracking**: Lightweight Kanban (Notion/Jira/Trello) with WIP limits to avoid bottlenecks.

## Testing & Quality Gates

- **Unit Tests** for each agent's decision logic and prompt output validation.
- **Contract Tests** verifying JSON schema compatibility between backend and frontend.
- **End-to-End Script** simulating event creation, conflict resolution, and asset delivery.
- **Performance Checks** to ensure scheduling and flow suggestions return in <2s.
- **Manual QA** for content tone, sponsor relevance, and analytics accuracy.

## Submission Checklist

- ⏳ Working demo link (live or recorded)
- ⏳ Pitch deck in `docs/pitch-deck/`
- ✅ README updated with setup + walkthrough (✅)
- ✅ Sample data for events and sponsors
- ⏳ Video walkthrough (≤2 minutes)
- ✅ Clear commit history with final release tag

## Future Scope

- Integrate directly with campus ERP for venue booking and attendance syncing.
- Add automated resource allocation (rooms, AV equipment, catering).
- Expand sponsor agent with real campus/industry datasets and CRM integration.
- Build voice/WhatsApp bot for conversational event creation and approvals.
- Enable predictive analytics for attendee turnout and sponsorship success.

---

✨ **Apokria makes campus events effortless.** Use this playbook to rally your team, ship fast, and wow the judges.
