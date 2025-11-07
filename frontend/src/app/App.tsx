import { RouterProvider } from "react-router-dom";
import QueryProvider from "./query";
import { router } from "./routes";

export default function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Apokria</h1>
            <span className="text-sm opacity-70">Where Every Campus Event Finds Its Perfect Flow</span>
          </header>
          <RouterProvider router={router} />
        </div>
      </div>
    </QueryProvider>
  );
}
