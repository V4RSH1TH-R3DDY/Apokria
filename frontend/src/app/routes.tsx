import { createBrowserRouter } from "react-router-dom";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";

export const router = createBrowserRouter([
  { path: "/", element: <EventsPage /> },
  { path: "/events/:id", element: <EventDetailPage /> },
]);
