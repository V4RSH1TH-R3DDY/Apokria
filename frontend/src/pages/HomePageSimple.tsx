import { useEvents } from '../contexts/EventContext';

export default function HomePageSimple() {
  const { events, scheduleLogs } = useEvents();

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    completed: events.filter(e => e.status === 'completed').length,
    avgAttendees: events.length > 0 
      ? Math.round(events.reduce((sum, e) => sum + (e.attendees || 0), 0) / events.length)
      : 0,
    conflicts: scheduleLogs.filter(l => l.type === 'conflict' && l.status === 'pending').length
  };

  return (
    <div className="space-y-6 overflow-auto h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30" style={{ paddingLeft: '64px', paddingRight: '64px', paddingTop: '0px', paddingBottom: '24px' }}>
      {/* Quick Stats */}
      <h2 className="text-2xl font-semibold text-slate-200 mb-4">Quick Stats</h2>
      <div className="grid grid-cols-4" style={{ gap: '12px', marginBottom: '32px' }}>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-purple-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#a78bfa' }}>{stats.total}</div>
            <div className="text-xs" style={{ color: '#a78bfa' }}>Total Events</div>
          </div>
        </div>
        
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#22d3ee' }}>{stats.upcoming}</div>
            <div className="text-xs" style={{ color: '#22d3ee' }}>Upcoming</div>
          </div>
        </div>
        
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#4ade80' }}>{stats.completed}</div>
            <div className="text-xs" style={{ color: '#4ade80' }}>Completed</div>
          </div>
        </div>
        
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-orange-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#fb923c' }}>{stats.avgAttendees}</div>
            <div className="text-xs" style={{ color: '#fb923c' }}>Avg Attendance</div>
          </div>
        </div>
      </div>

      {/* Agent Analytics */}
      <h2 className="text-2xl font-semibold text-slate-200 mb-4">Agent Analytics</h2>
      <div className="grid grid-cols-3" style={{ gap: '12px', marginBottom: '32px' }}>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-purple-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Scheduler Agent</span>
              <span className="text-xs bg-purple-500/10 px-2 py-1 rounded-full" style={{ color: '#a78bfa' }}>Active</span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#a78bfa' }}>127</div>
            <div className="text-xs text-slate-400">Tasks Completed</div>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Success Rate</span>
                <span style={{ color: '#4ade80' }}>98.4%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Flow Agent</span>
              <span className="text-xs bg-cyan-500/10 px-2 py-1 rounded-full" style={{ color: '#22d3ee' }}>Active</span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#22d3ee' }}>89</div>
            <div className="text-xs text-slate-400">Workflows Optimized</div>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Avg Response</span>
                <span style={{ color: '#4ade80' }}>1.2s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-pink-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Sponsor Agent</span>
              <span className="text-xs bg-pink-500/10 px-2 py-1 rounded-full" style={{ color: '#ec4899' }}>Active</span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#ec4899' }}>43</div>
            <div className="text-xs text-slate-400">Matches Made</div>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Match Quality</span>
                <span style={{ color: '#4ade80' }}>95.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-slate-200">System Status</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 font-medium">Scheduler Agent</span>
              </div>
              <span className="text-xs bg-green-500/10 px-2 py-1 rounded-full" style={{ color: '#22c55e' }}>Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 font-medium">Flow Agent</span>
              </div>
              <span className="text-xs bg-green-500/10 px-2 py-1 rounded-full" style={{ color: '#22c55e' }}>Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 font-medium">Sponsor Agent</span>
              </div>
              <span className="text-xs bg-green-500/10 px-2 py-1 rounded-full" style={{ color: '#22c55e' }}>Active</span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg ${stats.conflicts > 0 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${stats.conflicts > 0 ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
                <span className="text-slate-300 font-medium">Schedule Conflicts</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${stats.conflicts > 0 ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                {stats.conflicts > 0 ? `${stats.conflicts} Found` : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
