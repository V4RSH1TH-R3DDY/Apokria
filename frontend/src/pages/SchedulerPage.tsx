import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VscCalendar, VscWatch, VscLocation, VscPerson, VscWarning, VscCheck, VscAdd } from 'react-icons/vsc';
import { useToast } from '../contexts/ToastContext';

interface TimeSlot {
  time: string;
  available: boolean;
  conflicts?: string[];
  suggestions?: string[];
}

interface ScheduleConflict {
  id: string;
  title: string;
  time: string;
  venue: string;
  type: 'hard' | 'soft';
  resolution?: string;
}

interface SmartSuggestion {
  id: string;
  type: 'time' | 'venue' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const SchedulerPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventForm, setEventForm] = useState({
    title: '',
    duration: '60',
    attendees: '50',
    venue: 'main-hall',
    priority: 'medium',
    startTime: '09:00'
  });
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scheduleOptimal, setScheduleOptimal] = useState(false);
  const { showToast } = useToast();

  const venues = [
    { value: 'main-hall', label: 'Main Hall', capacity: 200 },
    { value: 'conference-room-a', label: 'Conference Room A', capacity: 50 },
    { value: 'conference-room-b', label: 'Conference Room B', capacity: 30 },
    { value: 'auditorium', label: 'Auditorium', capacity: 500 },
    { value: 'workshop-room', label: 'Workshop Room', capacity: 25 },
    { value: 'outdoor-space', label: 'Outdoor Space', capacity: 300 }
  ];

  const priorities = ['low', 'medium', 'high', 'critical'];

  // Generate realistic time slots
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const conflicts = Math.random() > 0.8 ? ['Another Event'] : [];
        slots.push({
          time,
          available: conflicts.length === 0,
          conflicts,
          suggestions: Math.random() > 0.7 ? ['Consider moving to earlier slot'] : []
        });
      }
    }
    return slots;
  };

  // AI-powered conflict detection
  const analyzeSchedule = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      // Mock conflict detection
      const mockConflicts: ScheduleConflict[] = [
        {
          id: '1',
          title: 'Venue Double Booking',
          time: eventForm.startTime,
          venue: eventForm.venue,
          type: 'hard',
          resolution: 'Move to Conference Room B or delay by 1 hour'
        },
        {
          id: '2', 
          title: 'Speaker Availability',
          time: eventForm.startTime,
          venue: eventForm.venue,
          type: 'soft',
          resolution: 'Confirm with Dr. Smith - prefers afternoon slots'
        }
      ];

      // Mock AI suggestions
      const mockSuggestions: SmartSuggestion[] = [
        {
          id: '1',
          type: 'time',
          title: 'Optimal Time Slot',
          description: `Based on historical data, ${getOptimalTimeRecommendation()} has 23% higher attendance`,
          impact: 'high'
        },
        {
          id: '2', 
          type: 'venue',
          title: 'Venue Optimization',
          description: `Auditorium recommended for ${eventForm.attendees} attendees - better acoustics and AV setup`,
          impact: 'medium'
        },
        {
          id: '3',
          type: 'optimization',
          title: 'Schedule Efficiency',
          description: 'Adding 15min buffer reduces conflicts by 34% and improves satisfaction scores',
          impact: 'medium'
        }
      ];

      setConflicts(Math.random() > 0.3 ? mockConflicts : []);
      setSuggestions(mockSuggestions);
      setScheduleOptimal(Math.random() > 0.4);
      setIsAnalyzing(false);

      showToast({
        type: conflicts.length > 0 ? 'warning' : 'success',
        title: 'Analysis Complete',
        message: conflicts.length > 0 
          ? `Found ${conflicts.length} conflicts and ${suggestions.length} optimizations`
          : 'Schedule looks optimal!'
      });
    }, 2500);
  };

  const getOptimalTimeRecommendation = () => {
    const hour = parseInt(eventForm.startTime.split(':')[0]);
    if (hour >= 9 && hour <= 11) return '10:00 AM';
    if (hour >= 14 && hour <= 16) return '2:30 PM';
    return '10:30 AM';
  };

  const scheduleEvent = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast({
        type: 'success',
        title: 'Event Scheduled',
        message: `${eventForm.title} scheduled for ${selectedDate} at ${eventForm.startTime}`
      });
      // Reset form
      setEventForm({
        title: '',
        duration: '60',
        attendees: '50',
        venue: 'main-hall',
        priority: 'medium',
        startTime: '09:00'
      });
      setConflicts([]);
      setSuggestions([]);
    }, 1500);
  };

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, [selectedDate]);

  return (
    <div className="h-full flex flex-col bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <VscCalendar className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">AI Scheduler</h1>
            <p className="text-slate-400">Smart scheduling with conflict detection and optimization</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {scheduleOptimal && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-lg">
                <VscCheck className="text-green-400" size={16} />
                <span className="text-green-300 text-sm">Schedule Optimal</span>
              </div>
            )}
            {conflicts.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 rounded-lg">
                <VscWarning className="text-red-400" size={16} />
                <span className="text-red-300 text-sm">{conflicts.length} Conflicts</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Panel - Event Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 space-y-6 overflow-y-auto"
        >
          <div className="bg-slate-800/60 rounded-xl p-6 space-y-5">
            <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
              <VscAdd size={20} />
              Schedule Event
            </h3>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Event Title *
              </label>
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Team Meeting"
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <VscWatch size={16} />
                Start Time
              </label>
              <input
                type="time"
                value={eventForm.startTime}
                onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Duration (minutes)
              </label>
              <select
                value={eventForm.duration}
                onChange={(e) => setEventForm(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours</option>
              </select>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <VscLocation size={16} />
                Venue
              </label>
              <select
                value={eventForm.venue}
                onChange={(e) => setEventForm(prev => ({ ...prev, venue: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {venues.map(venue => (
                  <option key={venue.value} value={venue.value}>
                    {venue.label} (Cap: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Attendees */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <VscPerson size={16} />
                Expected Attendees
              </label>
              <input
                type="number"
                value={eventForm.attendees}
                onChange={(e) => setEventForm(prev => ({ ...prev, attendees: e.target.value }))}
                min="1"
                max="1000"
                className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Priority Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorities.map(priority => (
                  <motion.button
                    key={priority}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEventForm(prev => ({ ...prev, priority }))}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all text-center font-medium capitalize ${
                      eventForm.priority === priority
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {priority}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeSchedule}
                disabled={isAnalyzing || !eventForm.title}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-600/50 disabled:to-blue-700/50 text-white rounded-xl font-medium transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <VscWatch className="animate-spin" size={16} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <VscWarning size={16} />
                    Check Conflicts
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scheduleEvent}
                disabled={isAnalyzing || !eventForm.title || conflicts.filter(c => c.type === 'hard').length > 0}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-600/50 disabled:to-green-700/50 text-white rounded-xl font-bold transition-all"
              >
                <VscCalendar size={16} />
                Schedule Event
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Analysis Results */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Conflicts Section */}
          {conflicts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
                <VscWarning size={20} />
                Scheduling Conflicts ({conflicts.length})
              </h3>
              <div className="space-y-3">
                {conflicts.map(conflict => (
                  <div key={conflict.id} className="bg-red-900/30 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-red-200">{conflict.title}</div>
                        <div className="text-sm text-red-300 mt-1">
                          {conflict.time} • {conflict.venue}
                        </div>
                        {conflict.resolution && (
                          <div className="text-sm text-red-400 mt-2">
                            <strong>Resolution:</strong> {conflict.resolution}
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        conflict.type === 'hard' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {conflict.type === 'hard' ? 'Critical' : 'Warning'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
                <VscCheck size={20} />
                AI Recommendations ({suggestions.length})
              </h3>
              <div className="space-y-3">
                {suggestions.map(suggestion => (
                  <div key={suggestion.id} className="bg-blue-900/30 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-blue-200">{suggestion.title}</div>
                        <div className="text-sm text-blue-300 mt-2">{suggestion.description}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ml-3 ${
                        suggestion.impact === 'high' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : suggestion.impact === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {suggestion.impact} impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Time Slots Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-200 mb-4">Available Time Slots - {selectedDate}</h3>
            <div className="grid grid-cols-8 gap-2">
              {timeSlots.slice(0, 24).map(slot => (
                <div
                  key={slot.time}
                  className={`p-2 rounded text-xs text-center font-medium ${
                    slot.available
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                  title={slot.available ? 'Available' : slot.conflicts?.join(', ')}
                >
                  {slot.time}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
                <span className="text-green-300">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded"></div>
                <span className="text-red-300">Busy</span>
              </div>
            </div>
          </motion.div>

          {/* Schedule Optimization Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-purple-300 mb-4">Schedule Optimization Score</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Efficiency</span>
                  <span className="text-purple-300">87%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Conflict Avoidance</span>
                  <span className="text-blue-300">92%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Attendance Prediction</span>
                  <span className="text-green-300">79%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;