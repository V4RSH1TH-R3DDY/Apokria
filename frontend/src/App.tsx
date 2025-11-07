import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
              <Link to="/" className="group">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">
                  Apokria
                </h1>
                <p className="text-sm text-slate-400 mt-1">Where Every Campus Event Finds Its Perfect Flow</p>
              </Link>
            </header>
            <Routes>
              <Route path="/" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
