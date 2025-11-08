import { useState } from 'react';

export default function SponsorsPage() {
  const [showFindForm, setShowFindForm] = useState(false);

  return (
    <div className="space-y-5 min-h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30" style={{ paddingLeft: '64px', paddingRight: '64px', paddingTop: '16px', paddingBottom: '24px' }}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Sponsors and Invites</h2>
        <p className="text-slate-400 mt-1">Find and manage event sponsors</p>
      </div>

      <div className="flex items-center justify-between">
        <div></div>
        <button 
          onClick={() => setShowFindForm(!showFindForm)}
          className="group relative px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-xl transition-all text-white font-medium shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50"
        >
          <span className="flex items-center gap-2">
            {showFindForm ? 'Cancel' : 'Find Sponsors'}
          </span>
        </button>
      </div>

      {showFindForm && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-slate-200">Find Sponsors</h3>
          <FindSponsorsForm onClose={() => setShowFindForm(false)} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3" style={{ gap: '12px', marginBottom: '32px' }}>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-purple-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#a78bfa' }}>12</div>
            <div className="text-xs" style={{ color: '#a78bfa' }}>Active Sponsors</div>
          </div>
        </div>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#4ade80' }}>$25K</div>
            <div className="text-xs" style={{ color: '#4ade80' }}>Total Funding</div>
          </div>
        </div>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
          <div className="relative transition-all duration-300 group-hover:scale-105 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: '#22d3ee' }}>85%</div>
            <div className="text-xs" style={{ color: '#22d3ee' }}>Success Rate</div>
          </div>
        </div>
      </div>

      {/* Sponsor List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <SponsorCard name="TechCorp" tier="Gold" amount="$10,000" status="Active" />
        <SponsorCard name="StartupHub" tier="Silver" amount="$5,000" status="Active" />
        <SponsorCard name="InnovateCo" tier="Bronze" amount="$2,500" status="Pending" />
      </div>

      {/* Outreach Stats */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Outreach Stats</h2>
        <div className="grid grid-cols-2" style={{ gap: '12px' }}>
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-purple-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
            <div className="relative transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#a78bfa' }}>Emails Sent</span>
                <span className="text-xs rounded-full" style={{ color: '#a78bfa', backgroundColor: 'rgba(168, 139, 250, 0.1)', padding: '6px 12px' }}>This Month</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#a78bfa' }}>48</div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
            <div className="relative transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#4ade80' }}>Responses</span>
                <span className="text-xs rounded-full" style={{ color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px' }}>+12%</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#4ade80' }}>32</div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
            <div className="relative transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#22d3ee' }}>Meetings Scheduled</span>
                <span className="text-xs rounded-full" style={{ color: '#22d3ee', backgroundColor: 'rgba(34, 211, 238, 0.1)', padding: '6px 12px' }}>Active</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#22d3ee' }}>8</div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
            <div className="relative transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#4ade80' }}>Deals Closed</span>
                <span className="text-xs rounded-full" style={{ color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px' }}>Success</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#4ade80' }}>5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindSponsorsForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Event Type</label>
          <select className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
            <option>Academic Conference</option>
            <option>Cultural Festival</option>
            <option>Sports Event</option>
            <option>Workshop</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Budget Range</label>
          <select className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50">
            <option>Low ($0-$5K)</option>
            <option>Medium ($5K-$15K)</option>
            <option>High ($15K+)</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Expected Attendees</label>
        <input
          type="number"
          placeholder="e.g., 200"
          className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
        <input
          type="text"
          placeholder="e.g., Computer Science students"
          className="w-full px-3 py-2 bg-slate-900/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button 
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg text-slate-300 transition-all"
        >
          Cancel
        </button>
        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-lg text-white font-medium transition-all">
          Find Matches
        </button>
      </div>
    </div>
  );
}

function SponsorCard({ 
  name, 
  tier, 
  amount, 
  status 
}: { 
  name: string; 
  tier: string; 
  amount: string; 
  status: string;
}) {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'gold':
        return { color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.2)' };
      case 'silver':
        return { color: '#cbd5e1', backgroundColor: 'rgba(203, 213, 225, 0.2)' };
      case 'bronze':
        return { color: '#fb923c', backgroundColor: 'rgba(251, 146, 60, 0.2)' };
      default:
        return { color: '#a78bfa', backgroundColor: 'rgba(167, 139, 250, 0.2)' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { color: '#4ade80', backgroundColor: 'rgba(34, 197, 94, 0.2)' };
      case 'pending':
        return { color: '#fb923c', backgroundColor: 'rgba(249, 115, 22, 0.2)' };
      default:
        return { color: '#94a3b8', backgroundColor: 'rgba(148, 163, 184, 0.2)' };
    }
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderRadius: '16px' }}></div>
      <div className="relative transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(148, 163, 184, 0.1)', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-200">{name}</h3>
              <span className="text-xs rounded-full" style={{ ...getTierColor(tier), marginLeft: '6px', padding: '6px 12px' }}>
                {tier}
              </span>
            </div>
            <div className="text-2xl font-bold text-green-400">{amount}</div>
          </div>
          <span className="text-xs rounded-full" style={{ ...getStatusColor(status), padding: '6px 12px' }}>
            {status}
          </span>
        </div>
        
        <div className="flex gap-2 pt-3">
          <button className="flex-1 text-sm transition-all duration-300 hover:scale-105 active:scale-95" style={{ color: '#a78bfa', backgroundColor: 'rgba(167, 139, 250, 0.1)', padding: '12px 8px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            Generate Email
          </button>
          <button className="flex-1 text-sm transition-all duration-300 hover:scale-105 active:scale-95" style={{ color: '#22d3ee', backgroundColor: 'rgba(34, 211, 238, 0.1)', padding: '12px 8px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
