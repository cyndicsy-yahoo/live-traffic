import React, { useState } from 'react';
import { 
  TriangleAlert, 
  Search, 
  Filter, 
  Car, 
  Video, 
  Wrench, 
  Ban, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Incident, IncidentType } from '../types';

interface HazardsAlertsViewProps {
  incidents: Incident[];
  onVote: (id: string, vote: 'yes' | 'cleared') => void;
  onOpenReportIncident: () => void;
}

export const HazardsAlertsView: React.FC<HazardsAlertsViewProps> = ({
  incidents,
  onVote,
  onOpenReportIncident
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | IncidentType>('all');

  const filtered = incidents.filter(inc => {
    const matchesTab = activeTab === 'all' || inc.type === activeTab;
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.highway.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              INCIDENT COMMAND CENTER
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Hazards, Radar & Road Closures
          </h1>
          <p className="text-xs text-slate-500">
            Real-time verified reports by automated scout vehicles, CHP feeds, and driver confirmations.
          </p>
        </div>

        <button
          onClick={onOpenReportIncident}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#00a8b5] hover:bg-[#00929e] text-white rounded-lg text-xs font-bold shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report Road Hazard</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by highway (e.g. 101, I-80, Skyline)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00a8b5]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Hazards ({incidents.length})
          </button>
          <button
            onClick={() => setActiveTab('accident')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'accident' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Accidents
          </button>
          <button
            onClick={() => setActiveTab('speed_check')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'speed_check' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Speed Checks
          </button>
          <button
            onClick={() => setActiveTab('hazard')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'hazard' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Debris
          </button>
          <button
            onClick={() => setActiveTab('closure')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === 'closure' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Closures
          </button>
        </div>
      </div>

      {/* Incident Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    inc.type === 'accident'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : inc.type === 'speed_check'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : inc.type === 'closure'
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}>
                    {inc.badgeLabel}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {inc.highway}
                  </span>
                </div>

                {inc.delayText && (
                  <span className="text-xs font-bold font-display text-rose-600">
                    {inc.delayText}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold font-display text-slate-900 mb-1.5">
                {inc.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {inc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-500 text-[11px]">
                Reported {inc.reportedTimeAgo} • <strong>{inc.confirmations} Scouts</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onVote(inc.id, 'yes')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    inc.userVoted === 'yes'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Still Active ({inc.votesYes})
                </button>
                <button
                  onClick={() => onVote(inc.id, 'cleared')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    inc.userVoted === 'cleared'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Cleared ({inc.votesCleared})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
