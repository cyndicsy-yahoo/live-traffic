import React, { useState } from 'react';
import { 
  Car, 
  Video, 
  Wrench, 
  Ban, 
  Check, 
  X, 
  SlidersHorizontal, 
  CornerUpRight, 
  ShieldAlert,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Incident, IncidentType } from '../types';

interface HazardFeedProps {
  incidents: Incident[];
  onVote: (id: string, vote: 'yes' | 'cleared') => void;
  detourApplied: boolean;
  onApplyDetour: () => void;
  onDismissDetour: () => void;
  onSelectIncidentOnMap?: (incident: Incident) => void;
}

export const HazardFeed: React.FC<HazardFeedProps> = ({
  incidents,
  onVote,
  detourApplied,
  onApplyDetour,
  onDismissDetour,
  onSelectIncidentOnMap
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | IncidentType>('all');
  const [detourDismissed, setDetourDismissed] = useState(false);

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'accident') return inc.type === 'accident';
    if (selectedFilter === 'speed_check') return inc.type === 'speed_check';
    if (selectedFilter === 'hazard') return inc.type === 'hazard';
    if (selectedFilter === 'closure') return inc.type === 'closure';
    return true;
  });

  const getIncidentIcon = (type: IncidentType) => {
    switch (type) {
      case 'accident':
        return <Car className="w-5 h-5 text-rose-500" />;
      case 'speed_check':
        return <Video className="w-5 h-5 text-indigo-500" />;
      case 'hazard':
        return <Wrench className="w-5 h-5 text-sky-500" />;
      case 'closure':
        return <Ban className="w-5 h-5 text-slate-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
    }
  };

  const getIconContainerBg = (type: IncidentType) => {
    switch (type) {
      case 'accident':
        return 'bg-rose-50 border-rose-100';
      case 'speed_check':
        return 'bg-indigo-50 border-indigo-100';
      case 'hazard':
        return 'bg-sky-50 border-sky-100';
      case 'closure':
        return 'bg-slate-100 border-slate-200';
      default:
        return 'bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Real-time Hazard Feed
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Validated live reports from scout vehicles & municipal highway feeds.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#00a8b5] animate-pulse" />
            <span>Auto-syncing</span>
          </div>
          <button 
            title="Feed Options"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Incidents (18)
        </button>
        <button
          onClick={() => setSelectedFilter('accident')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'accident'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Accidents (4)
        </button>
        <button
          onClick={() => setSelectedFilter('speed_check')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'speed_check'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Speed Checks (6)
        </button>
        <button
          onClick={() => setSelectedFilter('hazard')}
          className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'hazard'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          Road Hazards (8)
        </button>
      </div>

      {/* Critical Detour Advisory Banner Card */}
      {!detourDismissed && (
        <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-2xl p-5 shadow-xs relative overflow-hidden transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">
                  CRITICAL DETOUR ADVISORY • 2 min ago
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 leading-snug">
                CTE Southbound Multi-Vehicle Collision
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                2 Right lanes blocked before Braddell Flyover Exit. Current delay: <strong className="text-rose-600">+19 mins</strong>. 
                Reroute via Marymount Road / Thomson Road available.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5 shrink-0">
              <button
                onClick={onApplyDetour}
                disabled={detourApplied}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-all ${
                  detourApplied 
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#00a8b5] hover:bg-[#00929e] active:bg-[#007c87] text-white cursor-pointer'
                }`}
              >
                <CornerUpRight className="w-3.5 h-3.5" />
                <span>{detourApplied ? 'Detour Applied (-14m)' : 'Apply Detour (-14m)'}</span>
              </button>
              <button
                onClick={() => {
                  setDetourDismissed(true);
                  onDismissDetour();
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors cursor-pointer"
              >
                Dismiss Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Cards List */}
      <div className="space-y-3">
        {filteredIncidents.map((incident) => {
          return (
            <div
              key={incident.id}
              onClick={() => onSelectIncidentOnMap && onSelectIncidentOnMap(incident)}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
            >
              {/* Card Header & Badges */}
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getIconContainerBg(incident.type)}`}>
                  {getIncidentIcon(incident.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className="text-base font-bold font-display text-slate-900 truncate">
                      {incident.title}
                    </h4>

                    {/* Right status badge and metrics */}
                    <div className="flex items-center gap-2">
                      {incident.type === 'accident' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
                            Severe Delay
                          </span>
                          <span className="text-xs font-bold text-rose-600 font-display">
                            +11 min
                          </span>
                        </div>
                      )}

                      {incident.type === 'speed_check' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                            Mobile Radar
                          </span>
                          <span className="text-xs font-bold text-indigo-700 font-display">
                            45 MPH
                          </span>
                        </div>
                      )}

                      {incident.type === 'hazard' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
                            Cargo Debris
                          </span>
                          <span className="text-xs font-bold text-amber-600 font-display">
                            +4 min
                          </span>
                        </div>
                      )}

                      {incident.type === 'closure' && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-md">
                            Planned Closure
                          </span>
                          <span className="text-xs font-bold text-slate-900 font-display">
                            Closed
                          </span>
                        </div>
                      )}

                      {incident.secondaryTag && (
                        <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                          {incident.secondaryTag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {incident.description}
                  </p>

                  {/* Card Footer: confirmations & interactive buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-[#00a8b5]" />
                        {incident.confirmations} Driver Confirmations
                      </span>
                      <span>•</span>
                      <span>Reported {incident.reportedTimeAgo} by <strong className="text-slate-700 font-semibold">{incident.reportedBy}</strong></span>
                    </div>

                    {/* Interactive Still Here? Buttons */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {incident.type === 'closure' ? (
                        <button className="text-xs font-semibold text-[#00a8b5] hover:text-[#00828c] flex items-center gap-1">
                          <span>Show Alternate Entry</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <>
                          <span className="text-slate-400 font-medium text-[11px]">Still here?</span>
                          <button
                            onClick={() => onVote(incident.id, 'yes')}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                              incident.userVoted === 'yes'
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>👍</span>
                            <span>Yes ({incident.votesYes})</span>
                          </button>
                          <button
                            onClick={() => onVote(incident.id, 'cleared')}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                              incident.userVoted === 'cleared'
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>👎</span>
                            <span>Cleared ({incident.votesCleared})</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
