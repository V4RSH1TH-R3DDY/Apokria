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

function save(db: any) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export const mock = {
  listEvents(): Event[] {
    return load().events;
  },

  createEvent(payload: Partial<Event>): Event {
    const db = load();
    const ev: Event = {
      id: `evt_${Math.random().toString(36).slice(2,8)}`,
      name: payload.name || "Untitled Event",
      startDate: payload.startDate || new Date().toISOString(),
      endDate: payload.endDate || new Date().toISOString(),
      venue: payload.venue || null,
      capacity: payload.capacity ?? null,
      schedules: [],
      packages: [],
      assets: [],
      outreach: null,
    };
    db.events.unshift(ev);
    save(db);
    return ev;
  },

  getEvent(id: string): Event | undefined {
    return load().events.find((e: Event) => e.id === id);
  },

  genSchedule(id: string) {
    const db = load();
    const ev = db.events.find((e: Event) => e.id === id);
    if (!ev) return;
    const d1 = new Date(ev.startDate);
    const d2 = new Date(ev.endDate);
    ev.schedules = [
      { id: crypto.randomUUID(), day: 1, startTime: new Date(d1.setHours(9,0,0,0)).toISOString(), endTime: new Date(d1.setHours(11,0,0,0)).toISOString(), session: "Hackathon Kickoff", room: "Hall A" },
      { id: crypto.randomUUID(), day: 1, startTime: new Date(d1.setHours(11,30,0,0)).toISOString(), endTime: new Date(d1.setHours(13,0,0,0)).toISOString(), session: "Workshop: Robotics 101", room: "Lab 2" },
      { id: crypto.randomUUID(), day: 2, startTime: new Date(d2.setHours(10,0,0,0)).toISOString(), endTime: new Date(d2.setHours(12,0,0,0)).toISOString(), session: "Pitch Round", room: "Auditorium" },
      { id: crypto.randomUUID(), day: 2, startTime: new Date(d2.setHours(16,0,0,0)).toISOString(), endTime: new Date(d2.setHours(17,0,0,0)).toISOString(), session: "Awards & Closing", room: "Auditorium" },
    ];
    save(db);
  },

  genTiers(id: string) {
    const db = load();
    const ev = db.events.find((e: Event) => e.id === id);
    if (!ev) return;
    ev.packages = [
      { id: crypto.randomUUID(), tier: "Gold", benefits: ["Stage logo","Keynote mention","Stall","5 VIP passes"], price: 100000 },
      { id: crypto.randomUUID(), tier: "Silver", benefits: ["Backdrop logo","Stall","3 passes"], price: 50000 },
      { id: crypto.randomUUID(), tier: "Bronze", benefits: ["Website logo","2 passes"], price: 25000 },
    ];
    save(db);
  },

  genPDF(id: string) {
    const db = load();
    const ev = db.events.find((e: Event) => e.id === id);
    if (!ev) return;
    const version = (ev.assets?.length || 0) + 1;
    ev.assets.push({ id: crypto.randomUUID(), type: "pdf", url: "/sample-sponsor-deck.pdf", version, locale: "en" });
    save(db);
  },

  genOutreach(id: string) {
    const db = load();
    const ev = db.events.find((e: Event) => e.id === id);
    if (!ev) return;
    ev.outreach = {
      emailSponsor: `Subject: Partner with ${ev.name}\n\nHello Team,\nWe're hosting ${ev.name} on ${new Date(ev.startDate).toDateString()}–${new Date(ev.endDate).toDateString()}. Expecting ${ev.capacity||"200"}+ attendees. Sponsorship tiers attached.`,
      emailParticipants: `Subject: Register for ${ev.name}!\n\nJoin us ${new Date(ev.startDate).toDateString()}–${new Date(ev.endDate).toDateString()} at ${ev.venue||"campus"}.`,
      whatsapp: `Apokria Update: ${ev.name} — schedule & sponsor deck live. Check your mail.`,
    };
    save(db);
  },

  deleteEvent(id: string): void {
    const db = load();
    db.events = db.events.filter((e: Event) => e.id !== id);
    save(db);
  },
};
