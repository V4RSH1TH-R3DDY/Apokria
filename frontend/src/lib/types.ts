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

export type ScheduleItem = {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  session: string;
  room?: string | null;
};

export type Package = {
  id: string;
  tier: string;
  benefits: string[];
  price?: number | null;
};

export type Asset = {
  id: string;
  type: "pdf" | "image" | "csv";
  url: string;
  version: number;
  locale?: string | null;
};

export type OutreachBundle = {
  emailSponsor: string;
  emailParticipants: string;
  whatsapp: string;
};
