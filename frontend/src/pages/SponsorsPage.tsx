import React from 'react';
import { VscOrganization } from 'react-icons/vsc';

const SponsorsPage = () => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <VscOrganization className="text-blue-400" size={24} />
          <h1 className="text-2xl font-bold">Sponsors</h1>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <VscOrganization size={64} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">Sponsor Management</h2>
          <p className="text-slate-400">Coming Soon - Sponsor management functionality</p>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPage;