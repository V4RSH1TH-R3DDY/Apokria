type Package = {
  id: string;
  tier: string;
  benefits: string[];
  price?: number | null;
};

export default function SponsorsPanel({ packages }: { packages: Package[] }) {
  if (!packages?.length) return (
    <div className="text-center py-12">
      <div className="text-5xl mb-3">🤝</div>
      <p className="text-slate-400">No sponsor tiers yet. Generate them to get started.</p>
    </div>
  );

  const tierColors: Record<string, string> = {
    Gold: "from-yellow-600 to-amber-600",
    Silver: "from-slate-400 to-slate-500",
    Bronze: "from-orange-700 to-amber-800",
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {packages.map((p) => (
        <div key={p.id} className="group relative rounded-xl border border-white/10 bg-slate-950/50 p-6 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tierColors[p.tier] || "from-indigo-600 to-purple-600"} opacity-5 group-hover:opacity-10 transition-all`} />
          <div className="relative">
            <div className="text-lg font-bold uppercase tracking-wide text-white mb-4">{p.tier}</div>
            <ul className="space-y-2 mb-4">
              {p.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {p.price && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-2xl font-bold text-white">₹{p.price.toLocaleString("en-IN")}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
