import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Iridescence from "./components/Iridescence";
import Dock from "./components/Dock";
import CardNav from "./components/CardNav";
import { VscGraphLine, VscArchive, VscOrganization, VscCalendar } from 'react-icons/vsc';
import { useWindowManager } from "./components/WindowManager";
import Window from "./components/Window";
import HomePageSimple from "./pages/HomePageSimple";
import EventsPage from "./pages/EventsPage";
import SponsorsPage from "./pages/SponsorsPage";
import ScheduleLogPage from "./pages/ScheduleLogPage";
import { EventProvider, useEvents } from "./contexts/EventContext";
import { ToastProvider } from "./contexts/ToastContext";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const { windows, openWindow, closeWindow, minimizeWindow, focusWindow, getZIndex } = useWindowManager();

  const dockItems = [
    { 
      icon: <VscGraphLine size={18} />, 
      label: 'Analytics', 
      onClick: (position?: { x: number; y: number }) => openWindow({ 
        id: 'home', 
        title: 'Analytics', 
        content: <HomePageSimple />,
        dockIconPosition: position
      }),
      isActive: windows.some(w => w.id === 'home' && !w.isMinimized)
    },
    { 
      icon: <VscArchive size={18} />, 
      label: 'Events', 
      onClick: (position?: { x: number; y: number }) => openWindow({ 
        id: 'events', 
        title: 'Events', 
        content: <EventsPage />,
        dockIconPosition: position
      }),
      isActive: windows.some(w => w.id === 'events' && !w.isMinimized)
    },
    { 
      icon: <VscOrganization size={18} />, 
      label: 'Sponsors', 
      onClick: (position?: { x: number; y: number }) => openWindow({ 
        id: 'sponsors', 
        title: 'Sponsors', 
        content: <SponsorsPage />,
        dockIconPosition: position
      }),
      isActive: windows.some(w => w.id === 'sponsors' && !w.isMinimized)
    },
    { 
      icon: <VscCalendar size={18} />, 
      label: 'Schedule', 
      onClick: (position?: { x: number; y: number }) => openWindow({ 
        id: 'schedule', 
        title: 'Schedule Log', 
        content: <ScheduleLogPage />,
        dockIconPosition: position
      }),
      isActive: windows.some(w => w.id === 'schedule' && !w.isMinimized)
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <EventProvider>
        <ToastProvider>
        <BrowserRouter>
        <div className="min-h-screen w-screen relative" style={{ backgroundColor: '#020617', color: '#f1f5f9' }}>
            {/* Iridescence Background */}
            <Iridescence 
              color={[1, 0.4, 0.5]}
              mouseReact={true}
              amplitude={0.1}
              speed={0.5}
            />
          
          {/* Windows */}
          <AnimatePresence mode="popLayout">
            {windows.map((window, index) => (
              !window.isMinimized && (
                <Window
                  key={window.id}
                  id={window.id}
                  title={window.title}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  onFocus={() => focusWindow(window.id)}
                  zIndex={getZIndex(window.id)}
                  initialPosition={{ 
                    x: 100 + index * 30, 
                    y: 100 + index * 30 
                  }}
                  dockIconPosition={window.dockIconPosition}
                >
                  {window.content}
                </Window>
              )
            ))}
          </AnimatePresence>

          {/* CardNav Header */}
          <CardNav
            logo="/logo.svg"
            logoAlt="Apokria Logo"
            items={[
              {
                label: "Dashboard",
                bgColor: "#0D0716",
                textColor: "#fff",
                links: [
                  { label: "Home", ariaLabel: "Open Home", onClick: () => openWindow({ id: 'home', title: 'Dashboard', content: <HomePageSimple /> }) },
                  { label: "Events", ariaLabel: "Open Events", onClick: () => openWindow({ id: 'events', title: 'Events', content: <EventsPage /> }) }
                ]
              },
              {
                label: "Management",
                bgColor: "#170D27",
                textColor: "#fff",
                links: [
                  { label: "Sponsors", ariaLabel: "Open Sponsors", onClick: () => openWindow({ id: 'sponsors', title: 'Sponsors', content: <SponsorsPage /> }) },
                  { label: "Schedule", ariaLabel: "Open Schedule", onClick: () => openWindow({ id: 'schedule', title: 'Schedule Log', content: <ScheduleLogPage /> }) }
                ]
              },
              {
                label: "Resources",
                bgColor: "#271E37",
                textColor: "#fff",
                links: [
                  { label: "Help", ariaLabel: "Help Center", href: "#" },
                  { label: "Docs", ariaLabel: "Documentation", href: "#" }
                ]
              }
            ]}
            baseColor="rgba(0, 0, 0, 0.05)"
            menuColor="#00fffbff"
            buttonBgColor="#111"
            buttonTextColor="#fff"
            ease="power3.out"
          />

          {/* Event Log - Right Side Card */}
          <div style={{ position: 'fixed', right: '1.5rem', top: 'calc(6rem - 4px)', width: '20rem', zIndex: 1000 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                background: 'rgba(15, 23, 42, 0.5)',
                backdropFilter: 'blur(16px)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                maxHeight: '600px'
              }}>
                <div style={{ marginTop: '-6px' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-200">Event Log</h2>
                    </div>
                    <button 
                      onClick={() => openWindow({ 
                        id: 'events', 
                        title: 'Events', 
                        content: <EventsPage /> 
                      })}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <EventLogContent />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dock */}
          <Dock 
            items={dockItems}
            panelHeight={68}              // Width of vertical dock panel
            baseItemSize={50}             // Base size of icons
            magnification={70}            // Size when hovered
            backgroundColor="rgba(6, 0, 16, 0.8)"  // Change background color & transparency
            borderColor="rgba(132, 0, 255, 0.4)"   // Change border color
          />
        </div>
      </BrowserRouter>
      </ToastProvider>
      </EventProvider>
    </QueryClientProvider>
  );
}

function EventLogContent() {
  const { events } = useEvents();
  
  // Sort events by createdAt (most recent first) and take the most recent ones
  const sortedEvents = [...events].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  
  const upcomingEvents = sortedEvents.filter(e => e.status === 'upcoming').slice(0, 2);
  const scheduledEvents = sortedEvents.filter(e => e.status === 'scheduled').slice(0, 2);

  return (
    <>
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Upcoming</h3>
          <div className="space-y-1">
            {upcomingEvents.map(event => (
              <EventLogItem
                key={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                venue={event.venue}
                status="upcoming"
              />
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Events */}
      {scheduledEvents.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Recently Scheduled</h3>
          <div className="space-y-1">
            {scheduledEvents.map(event => (
              <EventLogItem
                key={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                venue={event.venue}
                status="scheduled"
              />
            ))}
          </div>
        </div>
      )}
      
      {upcomingEvents.length === 0 && scheduledEvents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No events yet</p>
          <p className="text-slate-500 text-xs mt-1">Create an event to see it here</p>
        </div>
      )}
    </>
  );
}

function EventLogItem({
  title,
  date,
  time,
  venue,
  status,
}: {
  title: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'scheduled';
}) {
  const borderColor = status === 'upcoming' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(168, 85, 247, 0.4)';

  return (
    <div style={{ position: 'relative', marginBottom: '8px' }}>
      <div style={{
        position: 'relative',
        background: 'transparent',
        borderRadius: '10px',
        padding: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            backgroundColor: status === 'upcoming' ? '#06b6d4' : '#a855f7',
            marginTop: '6px',
            flexShrink: 0
          }}></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <h4 style={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#f1f5f9',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: '1.2'
              }}>{title}</h4>
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: status === 'upcoming' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                color: status === 'upcoming' ? '#67e8f9' : '#d8b4fe',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}>
                {status}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.3' }}>
                <span>{date}</span>
                <span style={{ color: '#475569' }}>•</span>
                <span>{time}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.3' }}>
                {venue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
