import { useState } from 'react';
import { useEvents } from '../contexts/EventContext';

export default function ScheduleLogPage() {
  const { scheduleLogs } = useEvents();
  const [filter, setFilter] = useState<'all' | 'conflicts' | 'suggestions'>('all');

  const filteredLogs = scheduleLogs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'conflicts') return log.type === 'conflict';
    if (filter === 'suggestions') return log.type === 'suggestion';
    return true;
  });

  const stats = {
    total: scheduleLogs.length,
    conflicts: scheduleLogs.filter(l => l.type === 'conflict').length,
    suggestions: scheduleLogs.filter(l => l.type === 'suggestion').length,
    resolved: scheduleLogs.filter(l => l.status === 'resolved' || l.status === 'completed').length
  };

  return (
    <div className="space-y-5 min-h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30" style={{ paddingLeft: '64px', paddingRight: '64px', paddingTop: '16px', paddingBottom: '24px' }}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Schedule Log</h2>
        <p className="text-slate-400 mt-1">View scheduling history and conflicts</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex gap-2 bg-slate-900/60 backdrop-blur-xl rounded-xl p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('conflicts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'conflicts'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Conflicts
          </button>
          <button
            onClick={() => setFilter('suggestions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'suggestions'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Suggestions
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4" style={{ gap: '12px', marginBottom: '32px' }}>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#60a5fa' }}>{stats.total}</div>
            <div className="text-xs" style={{ color: '#60a5fa' }}>Total Checks</div>
          </div>
        </div>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-red-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#f87171' }}>{stats.conflicts}</div>
            <div className="text-xs" style={{ color: '#f87171' }}>Conflicts</div>
          </div>
        </div>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-amber-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#fbbf24' }}>{stats.suggestions}</div>
            <div className="text-xs" style={{ color: '#fbbf24' }}>Suggestions</div>
          </div>
        </div>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#4ade80' }}>{stats.resolved}</div>
            <div className="text-xs" style={{ color: '#4ade80' }}>Resolved</div>
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">

            <p className="text-slate-400">No schedule logs yet</p>
            <p className="text-sm text-slate-500 mt-1">Create events to see scheduling activity</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <LogEntry
              key={log.id}
              type={log.type}
              timestamp={log.timestamp}
              title={log.title}
              description={log.description}
              details={log.details}
              status={log.status}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LogEntry({
  type,
  timestamp,
  title,
  description,
  details,
  status,
}: {
  type: 'conflict' | 'suggestion' | 'success';
  timestamp: string;
  title: string;
  description: string;
  details: string;
  status: 'pending' | 'resolved' | 'accepted' | 'completed';
}) {
  const getTypeStyles = () => {
    switch (type) {
      case 'conflict':
        return {
          icon: '!',
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-400',
          glowColor: 'from-red-500/20 to-red-600/20'
        };
      case 'suggestion':
        return {
          icon: 'i',
          iconBg: 'bg-cyan-500/20',
          iconColor: 'text-cyan-400',
          glowColor: 'from-cyan-500/20 to-cyan-600/20'
        };
      case 'success':
        return {
          icon: '✓',
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-400',
          glowColor: 'from-green-500/20 to-green-600/20'
        };
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'resolved':
        return { color: '#4ade80', backgroundColor: 'rgba(34, 197, 94, 0.2)' };
      case 'completed':
        return { color: '#4ade80', backgroundColor: 'rgba(34, 197, 94, 0.2)' };
      case 'accepted':
        return { color: '#60a5fa', backgroundColor: 'rgba(59, 130, 246, 0.2)' };
      case 'pending':
        return { color: '#fb923c', backgroundColor: 'rgba(249, 115, 22, 0.2)' };
      default:
        return { color: '#fb923c', backgroundColor: 'rgba(249, 115, 22, 0.2)' };
    }
  };

  const styles = getTypeStyles();
  const statusStyles = getStatusStyles();

  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.glowColor} blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300`} style={{ borderRadius: '16px' }}></div>
      <div className="relative transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${styles.iconBg} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-base font-semibold text-slate-200 leading-tight">{title}</h3>
              <span className="text-sm rounded-full whitespace-nowrap font-medium flex items-center justify-center" style={{ ...statusStyles, padding: '8px 20px' }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-2 leading-relaxed">{description}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{details}</p>
              <div className="text-xs text-slate-600 bg-slate-800/50 px-2 py-1 rounded">{timestamp}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
