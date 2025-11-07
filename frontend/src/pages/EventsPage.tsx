import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import CreateEventModal from "../components/CreateEventModal";

export default function EventsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["events"], queryFn: api.listEvents });

  return (
    <main>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Events</h2>
          <p className="text-slate-400 mt-1">Manage your campus events</p>
        </div>
        <CreateEventModal onCreated={() => qc.invalidateQueries({ queryKey: ["events"] })} />
      </div>

      {isLoading && <div className="text-sm text-slate-400">Loading events…</div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((ev) => (
          <Link 
            key={ev.id} 
            to={`/events/${ev.id}`} 
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all" />
            <div className="relative">
              <div className="text-xl font-bold text-white mb-2">{ev.name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span>📅</span>
                <span>{new Date(ev.startDate).toLocaleDateString()} → {new Date(ev.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span>📍</span>
                <span>{ev.venue || "TBD Venue"}</span>
              </div>
              {ev.capacity && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                  <span>👥</span>
                  <span>{ev.capacity} capacity</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && (!data || data.length === 0) && (
        <div className="mt-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg text-slate-400">No events yet. Create one to get started.</p>
        </div>
      )}
    </main>
  );
}
