import { createContext, useContext, useState, ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category?: string;
  attendees?: number;
  status: 'upcoming' | 'scheduled' | 'completed';
  createdAt?: number;
}

export interface ScheduleLog {
  id: string;
  type: 'conflict' | 'suggestion' | 'success';
  timestamp: string;
  title: string;
  description: string;
  details: string;
  status: 'pending' | 'resolved' | 'accepted' | 'completed';
  eventId?: string;
}

interface EventContextType {
  events: Event[];
  scheduleLogs: ScheduleLog[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  addScheduleLog: (log: Omit<ScheduleLog, 'id'>) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Tech Conference 2024',
      date: 'Dec 15',
      time: '2:00 PM',
      venue: 'Main Auditorium',
      category: 'Technology',
      attendees: 250,
      status: 'upcoming',
      createdAt: Date.now() - 3600000
    },
    {
      id: '2',
      title: 'Cultural Festival',
      date: 'Dec 20',
      time: '10:00 AM',
      venue: 'Campus Grounds',
      category: 'Cultural',
      attendees: 500,
      status: 'upcoming',
      createdAt: Date.now() - 7200000
    },
    {
      id: '3',
      title: 'AI Workshop',
      date: 'Dec 10',
      time: '3:00 PM',
      venue: 'Room 301',
      category: 'Education',
      attendees: 50,
      status: 'scheduled',
      createdAt: Date.now() - 10800000
    },
    {
      id: '4',
      title: 'Career Fair',
      date: 'Dec 8',
      time: '9:00 AM',
      venue: 'Sports Complex',
      category: 'Career',
      attendees: 300,
      status: 'scheduled',
      createdAt: Date.now() - 14400000
    }
  ]);

  const [scheduleLogs, setScheduleLogs] = useState<ScheduleLog[]>([
    {
      id: '1',
      type: 'conflict',
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      title: 'Scheduling Conflict Detected',
      description: 'Tech Conference overlaps with Career Fair in Main Auditorium',
      details: 'Both events scheduled for Dec 15, 2024, 2:00 PM - 5:00 PM',
      status: 'resolved'
    },
    {
      id: '2',
      type: 'suggestion',
      timestamp: new Date(Date.now() - 7200000).toLocaleString(),
      title: 'Alternative Time Suggested',
      description: 'Workshop can be moved to Dec 16, 2024, 10:00 AM',
      details: 'Venue available, no conflicts detected',
      status: 'pending'
    }
  ]);

  const addEvent = (event: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setEvents([newEvent, ...events]);

    // Check for conflicts
    const conflicts = checkForConflicts(newEvent, events);
    if (conflicts.length > 0) {
      conflicts.forEach(conflict => {
        addScheduleLog({
          type: 'conflict',
          timestamp: new Date().toLocaleString(),
          title: 'Potential Scheduling Conflict',
          description: `${newEvent.title} may conflict with ${conflict.title}`,
          details: `Both events at ${newEvent.venue} on ${newEvent.date}`,
          status: 'pending',
          eventId: newEvent.id
        });
      });
    } else {
      addScheduleLog({
        type: 'success',
        timestamp: new Date().toLocaleString(),
        title: 'Event Scheduled Successfully',
        description: `${newEvent.title} has been added to the schedule`,
        details: `${newEvent.date} at ${newEvent.time} - ${newEvent.venue}`,
        status: 'completed',
        eventId: newEvent.id
      });
    }
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const addScheduleLog = (log: Omit<ScheduleLog, 'id'>) => {
    const newLog = {
      ...log,
      id: Date.now().toString()
    };
    setScheduleLogs([newLog, ...scheduleLogs]);
  };

  const checkForConflicts = (newEvent: Event, existingEvents: Event[]): Event[] => {
    return existingEvents.filter(event => 
      event.venue === newEvent.venue && 
      event.date === newEvent.date &&
      event.id !== newEvent.id
    );
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      scheduleLogs,
      addEvent, 
      removeEvent, 
      updateEvent,
      addScheduleLog 
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
}
