import type { Event } from "./types";
import { mock } from "./mock";

const BASE = import.meta.env.VITE_API_BASE as string | undefined;

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers||{})
    }
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// Switch: use real backend if BASE is set, otherwise use mocks
export const api = {
  listEvents(): Promise<Event[]> {
    return BASE ? j<Event[]>(`/events`) : Promise.resolve(mock.listEvents());
  },

  createEvent(payload: Partial<Event>): Promise<Event> {
    return BASE
      ? j<Event>(`/events`, { method: "POST", body: JSON.stringify(payload) })
      : Promise.resolve(mock.createEvent(payload));
  },

  getEvent(id: string): Promise<Event> {
    return BASE
      ? j<Event>(`/events/${id}`)
      : Promise.resolve(mock.getEvent(id) as Event);
  },

  genSchedule(id: string) {
    return BASE
      ? j(`/events/${id}/schedule/generate`, { method: "POST" })
      : Promise.resolve(mock.genSchedule(id));
  },

  genTiers(id: string) {
    return BASE
      ? j(`/events/${id}/sponsor/tiers`, { method: "POST" })
      : Promise.resolve(mock.genTiers(id));
  },

  genPDF(id: string) {
    return BASE
      ? j(`/events/${id}/sponsor/pdf`, { method: "POST" })
      : Promise.resolve(mock.genPDF(id));
  },

  genOutreach(id: string) {
    return BASE
      ? j(`/events/${id}/outreach/generate`, { method: "POST" })
      : Promise.resolve(mock.genOutreach(id));
  },
};
