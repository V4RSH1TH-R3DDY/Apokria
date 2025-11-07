type Asset = {
  id: string;
  type: "pdf" | "image" | "csv";
  url: string;
  version: number;
  locale?: string | null;
};

type OutreachBundle = {
  emailSponsor: string;
  emailParticipants: string;
  whatsapp: string;
};

export default function EventKitPanel({ assets, outreach }: { assets: Asset[]; outreach: OutreachBundle | null }) {
  const pdfs = assets?.filter(a => a.type === "pdf") || [];

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium">Exports</div>
        {pdfs.length === 0 && <p className="text-sm opacity-70">No exports yet.</p>}
        <ul className="space-y-1">
          {pdfs.map((a) => (
            <li key={a.id}>
              <a className="text-indigo-300 underline" href={a.url} target="_blank" rel="noreferrer">
                {a.locale ? `${a.type.toUpperCase()} (${a.locale})` : a.type.toUpperCase()} v{a.version}
              </a>
            </li>
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
