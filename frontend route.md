# Apokria — React (Vite) Starter
Single‑page app (SPA) using **React + Vite + TypeScript + Tailwind + React Query + React Router**. Includes drop‑in **mock API** (localStorage) so you can demo without a backend, and swappable API client for FastAPI later.

---

## 🚀 Quickstart

```bash
# 1) Create project
npm create vite@latest apokria-react -- --template react-ts
cd apokria-react

# 2) Install deps
npm i @tanstack/react-query react-router-dom clsx date-fns
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3) Tailwind config
# tailwind.config.js →
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

# src/index.css →
@tailwind base; @tailwind components; @tailwind utilities;
:root { color-scheme: dark; }

# 4) Run
npm run dev
```

Create **.env** (optional)
```env
VITE_API_BASE=http://localhost:8000   # leave empty to use mock API
```

---

## 📁 Folder Structure
```
src/
  main.tsx
  index.css
  app/
    App.tsx
    routes.tsx
    query.tsx
  pages/
    EventsPage.tsx
    EventDetailPage.tsx
  components/
    CreateEventModal.tsx
    ScheduleTable.tsx
    SponsorsPanel.tsx
    EventKitPanel.tsx
  lib/
    api.ts
    types.ts
    mock.ts
    utils.ts
```

---

## 🔌 React Query Provider & Router

**src/app/query.tsx**
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

**src/app/routes.tsx**
```tsx
import { createBrowserRouter } from "react-router-dom";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";

export const router = createBrowserRouter([
  { path: "/", element: <EventsPage /> },
  { path: "/events/:id", element: <EventDetailPage /> },
]);
```

**src/app/App.tsx**
```tsx
import { RouterProvider } from "react-router-dom";
import QueryProvider from "./query";
import { router } from "./routes";

export default function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Apokria</h1>
            <span className="text-sm opacity-70">Where Every Campus Event Finds Its Perfect Flow</span>
          </header>
          <RouterProvider router={router} />
        </div>
      </div>
    </QueryProvider>
  );
}
```

**src/main.tsx**
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 🧩 Types & API Client (with mocks)

**src/lib/types.ts**
```ts
export type Event = {
  id: string;
  name: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  venue?: string | null;
  capacity?: number | null;
  schedules?: ScheduleItem[];
  packages?: Package[];
  assets?: Asset[];
  outreach?: OutreachBundle | null;
};
export type ScheduleItem = { id: string; day: number; startTime: string; endTime: string; session: string; room?: string | null };
export type Package = { id: string; tier: string; benefits: string[]; price?: number | null };
export type Asset = { id: string; type: "pdf" | "image" | "csv"; url: string; version: number; locale?: string | null };
export type OutreachBundle = { emailSponsor: string; emailParticipants: string; whatsapp: string };
```

**src/lib/mock.ts** (localStorage mock API)
```ts
import type { Event } from "./types";

const KEY = "apokria_db_v1";

function load() {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const seed = {
    events: [
      {
        id: "evt_demo",
        name: "TechFest 2025",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
        venue: "Main Auditorium",
        capacity: 200,
        schedules: [],
        packages: [],
        assets: [],
        outreach: null,
      },
    ],
  };
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}
function save(db: any) { localStorage.setItem(KEY, JSON.stringify(db)); }

export const mock = {
  listEvents(): Event[] { return load().events; },
  createEvent(payload: Partial<Event>): Event {
    const db = load();
    const ev: Event = {
      id: `evt_${Math.random().toString(36).slice(2,8)}`,
      name: payload.name || "Untitled Event",
      startDate: payload.startDate || new Date().toISOString(),
      endDate: payload.endDate || new Date().toISOString(),
      venue: payload.venue || null,
      capacity: payload.capacity ?? null,
      schedules: [], packages: [], assets: [], outreach: null,
    };
    db.events.unshift(ev); save(db); return ev;
  },
  getEvent(id: string): Event | undefined { return load().events.find((e: Event) => e.id === id); },
  genSchedule(id: string) {
    const db = load(); const ev = db.events.find((e: Event) => e.id === id); if (!ev) return;
    const d1 = new Date(ev.startDate); const d2 = new Date(ev.endDate);
    ev.schedules = [
      { id: crypto.randomUUID(), day: 1, startTime: new Date(d1.setHours(9,0,0,0)).toISOString(), endTime: new Date(d1.setHours(11,0,0,0)).toISOString(), session: "Hackathon Kickoff", room: "Hall A" },
      { id: crypto.randomUUID(), day: 1, startTime: new Date(d1.setHours(11,30,0,0)).toISOString(), endTime: new Date(d1.setHours(13,0,0,0)).toISOString(), session: "Workshop: Robotics 101", room: "Lab 2" },
      { id: crypto.randomUUID(), day: 2, startTime: new Date(d2.setHours(10,0,0,0)).toISOString(), endTime: new Date(d2.setHours(12,0,0,0)).toISOString(), session: "Pitch Round", room: "Auditorium" },
      { id: crypto.randomUUID(), day: 2, startTime: new Date(d2.setHours(16,0,0,0)).toISOString(), endTime: new Date(d2.setHours(17,0,0,0)).toISOString(), session: "Awards & Closing", room: "Auditorium" },
    ]; save(db);
  },
  genTiers(id: string) {
    const db = load(); const ev = db.events.find((e: Event) => e.id === id); if (!ev) return;
    ev.packages = [
      { id: crypto.randomUUID(), tier: "Gold", benefits: ["Stage logo","Keynote mention","Stall","5 VIP passes"], price: 100000 },
      { id: crypto.randomUUID(), tier: "Silver", benefits: ["Backdrop logo","Stall","3 passes"], price: 50000 },
      { id: crypto.randomUUID(), tier: "Bronze", benefits: ["Website logo","2 passes"], price: 25000 },
    ]; save(db);
  },
  genPDF(id: string) {
    const db = load(); const ev = db.events.find((e: Event) => e.id === id); if (!ev) return;
    const version = (ev.assets?.length || 0) + 1;
    ev.assets.push({ id: crypto.randomUUID(), type: "pdf", url: "/sample-sponsor-deck.pdf", version, locale: "en" }); save(db);
  },
  genOutreach(id: string) {
    const db = load(); const ev = db.events.find((e: Event) => e.id === id); if (!ev) return;
    ev.outreach = {
      emailSponsor: `Subject: Partner with ${ev.name}\n\nHello Team,\nWe’re hosting ${ev.name} on ${new Date(ev.startDate).toDateString()}–${new Date(ev.endDate).toDateString()}. Expecting ${ev.capacity||"200"}+ attendees. Sponsorship tiers attached.`,
      emailParticipants: `Subject: Register for ${ev.name}!\n\nJoin us ${new Date(ev.startDate).toDateString()}–${new Date(ev.endDate).toDateString()} at ${ev.venue||"campus"}.`,
      whatsapp: `Apokria Update: ${ev.name} — schedule & sponsor deck live. Check your mail.`,
    }; save(db);
  },
};
```

**src/lib/api.ts**
```ts
import type { Event } from "./types";
import { mock } from "./mock";

const BASE = import.meta.env.VITE_API_BASE as string | undefined;

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers||{}) } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// Switch: use real backend if BASE is set, otherwise use mocks
export const api = {
  listEvents(): Promise<Event[]> { return BASE ? j<Event[]>(`/events`) : Promise.resolve(mock.listEvents()); },
  createEvent(payload: Partial<Event>): Promise<Event> { return BASE ? j<Event>(`/events`, { method: "POST", body: JSON.stringify(payload) }) : Promise.resolve(mock.createEvent(payload)); },
  getEvent(id: string): Promise<Event> { return BASE ? j<Event>(`/events/${id}`) : Promise.resolve(mock.getEvent(id) as Event); },
  genSchedule(id: string) { return BASE ? j(`/events/${id}/schedule/generate`, { method: "POST" }) : Promise.resolve(mock.genSchedule(id)); },
  genTiers(id: string) { return BASE ? j(`/events/${id}/sponsor/tiers`, { method: "POST" }) : Promise.resolve(mock.genTiers(id)); },
  genPDF(id: string) { return BASE ? j(`/events/${id}/sponsor/pdf`, { method: "POST" }) : Promise.resolve(mock.genPDF(id)); },
  genOutreach(id: string) { return BASE ? j(`/events/${id}/outreach/generate`, { method: "POST" }) : Promise.resolve(mock.genOutreach(id)); },
};
```

---

## 🏠 Pages

**src/pages/EventsPage.tsx**
```tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import CreateEventModal from "../components/CreateEventModal";

export default function EventsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["events"], queryFn: api.listEvents });

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium">Events</h2>
        <CreateEventModal onCreated={() => qc.invalidateQueries({ queryKey: ["events"] })} />
      </div>

      {isLoading && <div className="text-sm opacity-70">Loading events…</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data?.map((ev) => (
          <Link key={ev.id} to={`/events/${ev.id}`} className="rounded-2xl border border-white/10 p-4 hover:bg-white/5">
            <div className="text-lg font-semibold">{ev.name}</div>
            <div className="text-xs opacity-70">{new Date(ev.startDate).toLocaleDateString()} → {new Date(ev.endDate).toLocaleDateString()}</div>
            <div className="mt-2 text-sm opacity-90">{ev.venue || "TBD Venue"}</div>
          </Link>
        ))}
      </div>

      {!isLoading && (!data || data.length === 0) && (
        <p className="mt-10 text-center text-sm opacity-70">No events yet. Create one to get started.</p>
      )}
    </main>
  );
}
```

**src/pages/EventDetailPage.tsx**
```tsx
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import ScheduleTable from "../components/ScheduleTable";
import SponsorsPanel from "../components/SponsorsPanel";
import EventKitPanel from "../components/EventKitPanel";

export default function EventDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: ev, isLoading } = useQuery({ queryKey: ["event", id], queryFn: () => api.getEvent(id!) });

  const scheduleMut = useMutation({ mutationFn: () => api.genSchedule(id!), onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) });
  const tiersMut = useMutation({ mutationFn: () => api.genTiers(id!), onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) });
  const pdfMut = useMutation({ mutationFn: () => api.genPDF(id!), onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) });
  const outreachMut = useMutation({ mutationFn: () => api.genOutreach(id!), onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) });

  if (isLoading || !ev) return <div>Loading…</div>;

  return (
    <main className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">{ev.name}</h2>
        <p className="text-sm opacity-70">{new Date(ev.startDate).toLocaleDateString()} → {new Date(ev.endDate).toLocaleDateString()}</p>
      </header>

      <section className="rounded-2xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium">Schedule</h3>
          <button onClick={() => scheduleMut.mutate()} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Generate Schedule</button>
        </div>
        <ScheduleTable items={ev.schedules || []} />
      </section>

      <section className="rounded-2xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium">Sponsors</h3>
          <div className="flex gap-2">
            <button onClick={() => tiersMut.mutate()} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Generate Tiers</button>
            <button onClick={() => pdfMut.mutate()} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Export PDF</button>
          </div>
        </div>
        <SponsorsPanel packages={ev.packages || []} />
      </section>

      <section className="rounded-2xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium">Event Kit</h3>
          <button onClick={() => outreachMut.mutate()} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Generate Outreach</button>
        </div>
        <EventKitPanel assets={ev.assets || []} outreach={ev.outreach || null} />
      </section>
    </main>
  );
}
```

---

## 🧱 Components

**src/components/CreateEventModal.tsx**
```tsx
import { useState } from "react";
import { api } from "../lib/api";

export default function CreateEventModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createEvent({ name, startDate: start, endDate: end, capacity: Number(capacity) || undefined });
      onCreated(); setOpen(false);
      setName(""); setStart(""); setEnd(""); setCapacity("");
    } finally { setLoading(false); }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20">Create Event</button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-slate-900 p-5 shadow-xl ring-1 ring-white/10">
            <h3 className="mb-4 text-lg font-semibold">New Event</h3>
            <label className="mb-2 block text-sm">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="mb-3 w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10"/>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm">Start</label>
                <input type="date" value={start} onChange={e=>setStart(e.target.value)} required className="mb-3 w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10"/>
              </div>
              <div>
                <label className="mb-2 block text-sm">End</label>
                <input type="date" value={end} onChange={e=>setEnd(e.target.value)} required className="mb-3 w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10"/>
              </div>
            </div>
            <label className="mb-2 block text-sm">Capacity</label>
            <input type="number" value={capacity} onChange={e=>setCapacity(e.target.value)} className="mb-4 w-full rounded-xl bg-slate-800 px-3 py-2 outline-none ring-1 ring-white/10"/>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-white/10">Cancel</button>
              <button disabled={loading} className="rounded-xl bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-600 disabled:opacity-60">{loading?"Creating…":"Create"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
```

**src/components/ScheduleTable.tsx**
```tsx
import { ScheduleItem } from "../lib/types";
export default function ScheduleTable({ items }: { items: ScheduleItem[] }) {
  if (!items?.length) return <p className="text-sm opacity-70">No schedule yet.</p>;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <th className="px-3 py-2 text-left">Day</th>
            <th className="px-3 py-2 text-left">Start</th>
            <th className="px-3 py-2 text-left">End</th>
            <th className="px-3 py-2 text-left">Session</th>
            <th className="px-3 py-2 text-left">Room</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="odd:bg-white/0 even:bg-white/[0.02]">
              <td className="px-3 py-2">{it.day}</td>
              <td className="px-3 py-2">{new Date(it.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
              <td className="px-3 py-2">{new Date(it.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
              <td className="px-3 py-2">{it.session}</td>
              <td className="px-3 py-2">{it.room || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**src/components/SponsorsPanel.tsx**
```tsx
import { Package } from "../lib/types";
export default function SponsorsPanel({ packages }: { packages: Package[] }) {
  if (!packages?.length) return <p className="text-sm opacity-70">No sponsor tiers yet.</p>;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {packages.map((p) => (
        <div key={p.id} className="rounded-xl border border-white/10 p-4">
          <div className="text-sm uppercase tracking-wide opacity-70">{p.tier}</div>
          <ul className="mt-2 list-inside list-disc text-sm opacity-90">
            {p.benefits.map((b, i) => (<li key={i}>{b}</li>))}
          </ul>
          {p.price && <div className="mt-3 text-sm opacity-80">₹{p.price.toLocaleString("en-IN")}</div>}
        </div>
      ))}
    </div>
  );
}
```

**src/components/EventKitPanel.tsx**
```tsx
import { Asset, OutreachBundle } from "../lib/types";
export default function EventKitPanel({ assets, outreach }: { assets: Asset[]; outreach: OutreachBundle | null }) {
  const pdfs = assets?.filter(a => a.type === "pdf") || [];
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium">Exports</div>
        {pdfs.length === 0 && <p className="text-sm opacity-70">No exports yet.</p>}
        <ul className="space-y-1">
          {pdfs.map((a) => (
            <li key={a.id}><a className="text-indigo-300 underline" href={a.url} target="_blank" rel="noreferrer">{a.locale ? `${a.type.toUpperCase()} (${a.locale})` : a.type.toUpperCase()} v{a.version}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">Outreach</div>
        {!outreach && <p className="text-sm opacity-70">Not generated.</p>}
        {outreach && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <TextareaBlock label="Sponsor Email" text={outreach.emailSponsor} />
            <TextareaBlock label="Participant Email" text={outreach.emailParticipants} />
            <TextareaBlock label="WhatsApp" text={outreach.whatsapp} />
          </div>
        )}
      </div>
    </div>
  );
}

function TextareaBlock({ label, text }: { label: string; text: string }) {
  const copy = () => navigator.clipboard.writeText(text);
  return (
    <div className="rounded-xl border border-white/10 p-3">
      <div className="mb-2 text-xs opacity-70">{label}</div>
      <textarea readOnly className="h-32 w-full resize-none rounded-lg bg-slate-800 p-2 text-sm outline-none" value={text} />
      <div className="mt-2 flex justify-end">
        <button onClick={copy} className="rounded-lg bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Copy</button>
      </div>
    </div>
  );
}
```

---

## ✅ Usage Notes
- By default the app uses **localStorage mocks**; it’s instant and survives refresh.
- When your FastAPI is up, set `VITE_API_BASE=http://localhost:8000` and the client will use real endpoints.
- Drop a placeholder file at `public/sample-sponsor-deck.pdf` for the PDF link to work in the mock.

That’s it — paste these files into a Vite React app and you’ve got the **Apokria** frontend running with create → generate schedule/tiers → export PDF → outreach in minutes. Iterate UI polish later (icons, toasts, skeletons).