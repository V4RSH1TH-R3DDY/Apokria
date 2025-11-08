import { useState } from "react";

const BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8000";

function pretty(obj: any) {
    try {
        return JSON.stringify(obj, null, 2);
    } catch {
        return String(obj);
    }
}

export default function Playground() {
    const [health, setHealth] = useState<string>("");
    const [flowResp, setFlowResp] = useState<string>("");
    const [contentResp, setContentResp] = useState<string>("");
    const [eventResp, setEventResp] = useState<string>("");
    const [sponsorResp, setSponsorResp] = useState<string>("");

    const [flowForm, setFlowForm] = useState({ event_name: "Sample Talk", event_type: "academic_conference", duration: 2, audience_size: 100 });
    const [contentForm, setContentForm] = useState({ type: "email", event: { title: "Sample Talk", date: "2025-12-01", venue: "Main Hall" }, tone: "professional", length: "short" });
    const [eventForm, setEventForm] = useState({ title: "Sample Talk", description: "A sample event", start_time: new Date().toISOString(), end_time: new Date(Date.now() + 3600 * 1000).toISOString(), venue: "Main Hall" });
    const [sponsorForm, setSponsorForm] = useState({ event_type: "academic_conference", audience_size: 100 });

    async function checkHealth() {
        setHealth("loading...");
        try {
            const r = await fetch(`${BASE}/health`);
            const j = await r.json();
            setHealth(pretty(j));
        } catch (e) {
            setHealth(String(e));
        }
    }

    async function genFlow() {
        setFlowResp("loading...");
        try {
            const r = await fetch(`${BASE}/api/flow`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(flowForm) });
            const j = await r.json();
            setFlowResp(pretty(j));
        } catch (e) {
            setFlowResp(String(e));
        }
    }

    async function genContent() {
        setContentResp("loading...");
        try {
            const r = await fetch(`${BASE}/api/content`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contentForm) });
            const j = await r.json();
            setContentResp(pretty(j));
        } catch (e) {
            setContentResp(String(e));
        }
    }

    async function createEvent() {
        setEventResp("loading...");
        try {
            const r = await fetch(`${BASE}/api/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(eventForm) });
            const j = await r.json();
            setEventResp(pretty(j));
        } catch (e) {
            setEventResp(String(e));
        }
    }

    async function recSponsors() {
        setSponsorResp("loading...");
        try {
            const r = await fetch(`${BASE}/api/sponsors`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sponsorForm) });
            const j = await r.json();
            setSponsorResp(pretty(j));
        } catch (e) {
            setSponsorResp(String(e));
        }
    }

    return (
        <main>
            <h2 className="text-3xl font-bold text-white mb-4">Playground</h2>

            <section className="mb-6">
                <h3 className="text-xl font-semibold text-white">Health</h3>
                <button onClick={checkHealth} className="mt-2 rounded bg-indigo-600 px-3 py-1">Check /health</button>
                <pre className="mt-2 max-h-40 overflow-auto bg-slate-800 p-3 rounded">{health}</pre>
            </section>

            <section className="mb-6">
                <h3 className="text-xl font-semibold text-white">Generate Flow</h3>
                <div className="mt-2">
                    <input value={flowForm.event_name} onChange={(e) => setFlowForm({ ...flowForm, event_name: e.target.value })} placeholder="Event name" className="mr-2 p-1 rounded text-black" />
                    <input value={String(flowForm.duration)} onChange={(e) => setFlowForm({ ...flowForm, duration: Number(e.target.value) })} placeholder="Duration (hours)" className="mr-2 p-1 rounded text-black w-28" />
                    <button onClick={genFlow} className="rounded bg-indigo-600 px-3 py-1">Generate</button>
                </div>
                <pre className="mt-2 max-h-60 overflow-auto bg-slate-800 p-3 rounded">{flowResp}</pre>
            </section>

            <section className="mb-6">
                <h3 className="text-xl font-semibold text-white">Generate Content</h3>
                <div className="mt-2 flex gap-2">
                    <select value={contentForm.type} onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })} className="p-1 rounded text-black">
                        <option value="email">Email</option>
                        <option value="social">Social</option>
                        <option value="banner">Banner</option>
                    </select>
                    <input value={contentForm.event.title} onChange={(e) => setContentForm({ ...contentForm, event: { ...contentForm.event, title: e.target.value } })} placeholder="Title" className="p-1 rounded text-black" />
                    <button onClick={genContent} className="rounded bg-indigo-600 px-3 py-1">Generate</button>
                </div>
                <pre className="mt-2 max-h-60 overflow-auto bg-slate-800 p-3 rounded">{contentResp}</pre>
            </section>

            <section className="mb-6">
                <h3 className="text-xl font-semibold text-white">Create Event</h3>
                <div className="mt-2 flex gap-2">
                    <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Title" className="p-1 rounded text-black" />
                    <input value={eventForm.start_time} onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })} className="p-1 rounded text-black" />
                    <input value={eventForm.end_time} onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })} className="p-1 rounded text-black" />
                    <button onClick={createEvent} className="rounded bg-indigo-600 px-3 py-1">Create</button>
                </div>
                <pre className="mt-2 max-h-60 overflow-auto bg-slate-800 p-3 rounded">{eventResp}</pre>
            </section>

            <section>
                <h3 className="text-xl font-semibold text-white">Recommend Sponsors</h3>
                <div className="mt-2 flex gap-2">
                    <input value={sponsorForm.event_type} onChange={(e) => setSponsorForm({ ...sponsorForm, event_type: e.target.value })} placeholder="Event type" className="p-1 rounded text-black" />
                    <input value={String(sponsorForm.audience_size)} onChange={(e) => setSponsorForm({ ...sponsorForm, audience_size: Number(e.target.value) })} placeholder="Audience size" className="p-1 rounded text-black w-28" />
                    <button onClick={recSponsors} className="rounded bg-indigo-600 px-3 py-1">Recommend</button>
                </div>
                <pre className="mt-2 max-h-60 overflow-auto bg-slate-800 p-3 rounded">{sponsorResp}</pre>
            </section>
        </main>
    );
}
