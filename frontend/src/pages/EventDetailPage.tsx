import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import ScheduleTable from "../components/ScheduleTable";
import SponsorsPanel from "../components/SponsorsPanel";
import EventKitPanel from "../components/EventKitPanel";

export default function EventDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: ev, isLoading } = useQuery({ 
    queryKey: ["event", id], 
    queryFn: () => api.getEvent(id!) 
  });

  const scheduleMut = useMutation({ 
    mutationFn: () => api.genSchedule(id!), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) 
  });
  const tiersMut = useMutation({ 
    mutationFn: () => api.genTiers(id!), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) 
  });
  const pdfMut = useMutation({ 
    mutationFn: () => api.genPDF(id!), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) 
  });
  const outreachMut = useMutation({ 
    mutationFn: () => api.genOutreach(id!), 
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event", id] }) 
  });

  if (isLoading || !ev) return <div className="text-white">Loading…</div>;

  return (
    <main className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back
        </Link>
      </div>

      <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-8 backdrop-blur-sm">
        <h2 className="text-4xl font-bold text-white mb-3">{ev.name}</h2>
        <div className="flex flex-wrap gap-6 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <span>{new Date(ev.startDate).toLocaleDateString()} → {new Date(ev.endDate).toLocaleDateString()}</span>
          </div>
          {ev.venue && (
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span>{ev.venue}</span>
            </div>
          )}
          {ev.capacity && (
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <span>{ev.capacity} capacity</span>
            </div>
          )}
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🗓️</span>
              Schedule
            </h3>
            <p className="text-sm text-slate-400 mt-1">Event timeline and sessions</p>
          </div>
          <button 
            onClick={() => scheduleMut.mutate()} 
            disabled={scheduleMut.isPending}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-60 transition-all"
          >
            {scheduleMut.isPending ? "Generating..." : "🤖 Generate Schedule"}
          </button>
        </div>
        <ScheduleTable items={ev.schedules || []} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🤝</span>
              Sponsors
            </h3>
            <p className="text-sm text-slate-400 mt-1">Sponsorship tiers and packages</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => tiersMut.mutate()} 
              disabled={tiersMut.isPending}
              className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 disabled:opacity-60 transition-all"
            >
              {tiersMut.isPending ? "Generating..." : "🤖 Generate Tiers"}
            </button>
            <button 
              onClick={() => pdfMut.mutate()} 
              disabled={pdfMut.isPending}
              className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 disabled:opacity-60 transition-all"
            >
              {pdfMut.isPending ? "Exporting..." : "📄 Export PDF"}
            </button>
          </div>
        </div>
        <SponsorsPanel packages={ev.packages || []} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📧</span>
              Event Kit
            </h3>
            <p className="text-sm text-slate-400 mt-1">Outreach materials and assets</p>
          </div>
          <button 
            onClick={() => outreachMut.mutate()} 
            disabled={outreachMut.isPending}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60 transition-all"
          >
            {outreachMut.isPending ? "Generating..." : "🤖 Generate Outreach"}
          </button>
        </div>
        <EventKitPanel assets={ev.assets || []} outreach={ev.outreach || null} />
      </section>
    </main>
  );
}
