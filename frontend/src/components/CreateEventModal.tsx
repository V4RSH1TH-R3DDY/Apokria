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
      onCreated();
      setOpen(false);
      setName("");
      setStart("");
      setEnd("");
      setCapacity("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105"
      >
        + Create Event
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
          <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl ring-1 ring-white/10">
            <h3 className="mb-6 text-2xl font-bold text-white">New Event</h3>
            <label className="mb-2 block text-sm font-medium text-slate-300">Event Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="mb-4 w-full rounded-xl bg-slate-950/50 px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="TechFest 2025"/>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Start Date</label>
                <input type="date" value={start} onChange={e=>setStart(e.target.value)} required className="mb-4 w-full rounded-xl bg-slate-950/50 px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all"/>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">End Date</label>
                <input type="date" value={end} onChange={e=>setEnd(e.target.value)} required className="mb-4 w-full rounded-xl bg-slate-950/50 px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all"/>
              </div>
            </div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Expected Capacity</label>
            <input type="number" value={capacity} onChange={e=>setCapacity(e.target.value)} className="mb-6 w-full rounded-xl bg-slate-950/50 px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="200"/>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={()=>setOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all">Cancel</button>
              <button disabled={loading} className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60 transition-all">{loading?"Creating…":"Create Event"}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
