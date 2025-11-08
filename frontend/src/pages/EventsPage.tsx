import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEvents } from "../contexts/EventContext";

export default function EventsPage() {
  const { events, addEvent, removeEvent } = useEvents();
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <main
      style={{
        paddingLeft: "64px",
        paddingRight: "64px",
        paddingTop: "16px",
        paddingBottom: "24px",
        position: "relative",
      }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Events</h2>
          <p className="text-slate-400 mt-1">Manage your campus events</p>
        </div>
        <button
          onClick={() => setShowCreatePanel(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all text-white font-medium"
          style={{
            padding: "11.5px 21.5px",
            border: "1px solid rgba(168, 85, 247, 0.5)",
            borderRadius: "16px",
            boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
          }}
        >
          + Create Event
        </button>
      </div>

      {/* Slide-in Create Panel */}
      <AnimatePresence>
        {showCreatePanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreatePanel(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 50,
              }}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                width: "500px",
                background:
                  "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "-10px 0 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(132, 0, 255, 0.1)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                borderRight: "none",
                zIndex: 51,
                overflowY: "auto",
              }}
            >
              <div style={{ padding: "32px" }}>
                {/* Header with gradient accent */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
                  <div className="relative flex items-center justify-between p-4 bg-slate-900/40 backdrop-blur-sm rounded-xl">
                    <h3 className="text-2xl font-bold text-white">
                      Create New Event
                    </h3>
                    <button
                      onClick={() => setShowCreatePanel(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <CreateEventForm
                  onSuccess={(event) => {
                    addEvent(event);
                    setShowCreatePanel(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "32px" }}
      >
        {events.map((ev) => (
          <div key={ev.id} className="group relative">
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ borderRadius: "16px" }}
            />
            <div
              className="relative transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                padding: "28px",
                borderRadius: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xl font-bold text-white">{ev.title}</div>
                </div>
                <button
                  onClick={() =>
                    setDeleteConfirm({ id: ev.id, name: ev.title })
                  }
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                  title="Delete event"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span>
                  {ev.date} • {ev.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                <span>📍 {ev.venue}</span>
              </div>
              {ev.category && (
                <div className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300 mr-2">
                  <span>{ev.category}</span>
                </div>
              )}
              {ev.attendees && (
                <div className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
                  <span>{ev.attendees} attendees</span>
                </div>
              )}
              <div
                className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                  ev.status === "upcoming"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : ev.status === "completed"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-purple-500/20 text-purple-300"
                }`}
              >
                <span>{ev.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="mt-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg text-slate-400">
            No events yet. Create one to get started.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "400px",
                background:
                  "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
                backdropFilter: "blur(24px)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 100px rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                zIndex: 101,
              }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Delete Event?
                </h3>
                <p className="text-slate-300 mb-1">
                  Are you sure you want to delete
                </p>
                <p className="text-purple-300 font-semibold">
                  "{deleteConfirm.name}"?
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeEvent(deleteConfirm.id);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg text-white font-medium transition-all shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function CreateEventForm({ onSuccess }: { onSuccess: (event: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    venue: "",
    capacity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert to EventContext format
    const startDate = new Date(formData.startDate);
    const event = {
      title: formData.name,
      date: startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      venue: formData.venue,
      category: "Event",
      attendees: formData.capacity ? parseInt(formData.capacity) : undefined,
      status: "upcoming" as const,
    };
    onSuccess(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-xl blur-lg"></div>
        <div
          className="relative bg-slate-900/40 backdrop-blur-sm rounded-xl"
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                backdropFilter: "blur(8px)",
              }}
              className="w-full px-4 py-3 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Enter event name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  backdropFilter: "blur(8px)",
                }}
                className="w-full px-4 py-3 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
                style={{
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  backdropFilter: "blur(8px)",
                }}
                className="w-full px-4 py-3 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Venue
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                backdropFilter: "blur(8px)",
              }}
              className="w-full px-4 py-3 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Enter venue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                backdropFilter: "blur(8px)",
              }}
              className="w-full px-4 py-3 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              placeholder="Enter capacity"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium transition-all hover:scale-105"
        style={{
          padding: "13.5px",
          border: "1px solid rgba(168, 85, 247, 0.5)",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
        }}
      >
        Create Event
      </button>
    </form>
  );
}
