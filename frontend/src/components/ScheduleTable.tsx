type ScheduleItem = {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  session: string;
  room?: string | null;
};

export default function ScheduleTable({ items }: { items: ScheduleItem[] }) {
  if (!items?.length) return (
    <div className="text-center py-12">
      <div className="text-5xl mb-3">📅</div>
      <p className="text-slate-400">No schedule yet. Generate one to get started.</p>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/30">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-white">Day</th>
            <th className="px-4 py-3 text-left font-semibold text-white">Start</th>
            <th className="px-4 py-3 text-left font-semibold text-white">End</th>
            <th className="px-4 py-3 text-left font-semibold text-white">Session</th>
            <th className="px-4 py-3 text-left font-semibold text-white">Room</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <tr key={it.id} className={`border-t border-white/5 ${idx % 2 === 0 ? "bg-white/[0.02]" : "bg-white/0"} hover:bg-white/5 transition-colors`}>
              <td className="px-4 py-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                  {it.day}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">{new Date(it.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
              <td className="px-4 py-3 text-slate-300">{new Date(it.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
              <td className="px-4 py-3 font-medium text-white">{it.session}</td>
              <td className="px-4 py-3 text-slate-400">{it.room || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
