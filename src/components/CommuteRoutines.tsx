import React, { useState } from 'react';
import { 
  Briefcase, 
  Dumbbell, 
  Plane, 
  Plus, 
  Lightbulb, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  Navigation,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Bell
} from 'lucide-react';
import { CommuteRoutine, WeeklyPatternDay, EnforcementCheckpoint } from '../types';

interface CommuteRoutinesProps {
  routines: CommuteRoutine[];
  selectedRoutineId: string;
  onSelectRoutine: (routine: CommuteRoutine) => void;
  onNewRoutine: () => void;
  weeklyPatterns: WeeklyPatternDay[];
  onOpenSetAlarm: (recommendedTime: string) => void;
  onEngageDrive: () => void;
  enforcements: EnforcementCheckpoint[];
  selectedStrategy: 'tollway' | 'scenic';
  setSelectedStrategy: (strat: 'tollway' | 'scenic') => void;
}

export const CommuteRoutines: React.FC<CommuteRoutinesProps> = ({
  routines,
  selectedRoutineId,
  onSelectRoutine,
  onNewRoutine,
  weeklyPatterns,
  onOpenSetAlarm,
  onEngageDrive,
  enforcements,
  selectedStrategy,
  setSelectedStrategy
}) => {
  const [hoveredDay, setHoveredDay] = useState<WeeklyPatternDay | null>(null);

  const getRoutineIcon = (type: string) => {
    switch (type) {
      case 'work':
        return <Briefcase className="w-4 h-4 text-[#00a8b5]" />;
      case 'fitness':
        return <Dumbbell className="w-4 h-4 text-sky-600" />;
      case 'airport':
        return <Plane className="w-4 h-4 text-indigo-600" />;
      default:
        return <Briefcase className="w-4 h-4 text-slate-600" />;
    }
  };

  const getIconContainerBg = (type: string) => {
    switch (type) {
      case 'work':
        return 'bg-cyan-50 border-cyan-100';
      case 'fitness':
        return 'bg-sky-50 border-sky-100';
      case 'airport':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const maxPatternMinutes = Math.max(...weeklyPatterns.map(p => Math.max(p.morningMinutes, p.eveningMinutes)));

  return (
    <div className="space-y-6">
      {/* 1. Saved Commute Routines Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              PREDICTIVE ENGINE
            </span>
            <h3 className="text-base font-bold font-display text-slate-900">
              Saved Commute Routines
            </h3>
          </div>
          <button
            onClick={onNewRoutine}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>New Routine</span>
          </button>
        </div>

        {/* Routine Cards */}
        <div className="space-y-2.5">
          {routines.map((routine) => {
            const isSelected = routine.id === selectedRoutineId;
            return (
              <div
                key={routine.id}
                onClick={() => onSelectRoutine(routine)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-50/30 border-[#00a8b5] shadow-xs ring-1 ring-[#00a8b5]/20'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getIconContainerBg(routine.iconType)}`}>
                      {getRoutineIcon(routine.iconType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold font-display text-slate-900">
                          {routine.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {routine.origin} → {routine.destination} ({routine.distance})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold font-display text-slate-900 leading-none">
                      {routine.durationFormatted}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                      {routine.optimalDepart ? `Optimal Depart: ${routine.optimalDepart}` : 'Toll-free Flow'}
                    </div>
                  </div>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                  {routine.tags.map((tag, idx) => {
                    let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                    if (tag.variant === 'danger') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
                    if (tag.variant === 'success') badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
                    if (tag.variant === 'indigo') badgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                    return (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md border font-medium ${badgeClass}`}
                      >
                        {tag.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Weekly Traffic Pattern Forecast */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold font-display text-slate-900">
              Weekly Traffic Pattern Forecast
            </h3>
            <p className="text-xs text-slate-500">
              Average commute latency by day (Historical + AI prediction)
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00a8b5]" />
              <span>Morning Peak</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-300" />
              <span>Evening Peak</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="pt-4 pb-2">
          <div className="flex items-end justify-between gap-2 h-28 px-1 border-b border-slate-100">
            {weeklyPatterns.map((item) => {
              const morningHeightPct = (item.morningMinutes / maxPatternMinutes) * 100;
              const eveningHeightPct = (item.eveningMinutes / maxPatternMinutes) * 100;
              return (
                <div 
                  key={item.shortDay} 
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  onMouseEnter={() => setHoveredDay(item)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div className="flex items-end gap-1 w-full justify-center h-full pb-1">
                    {/* Morning Bar */}
                    <div 
                      className="w-2.5 sm:w-3 bg-[#00a8b5] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${morningHeightPct}%` }}
                    />
                    {/* Evening Bar */}
                    <div 
                      className="w-2.5 sm:w-3 bg-sky-300 rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${eveningHeightPct}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 pt-1">
                    {item.shortDay}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ({item.morningMinutes}m)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation Banner */}
        <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0284c7]/10 flex items-center justify-center text-[#0284c7] shrink-0">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-700">
              <strong className="text-slate-900 font-semibold">Recommendation:</strong> Shift Wed departure to <strong>07:15 AM</strong> to save ~21 mins and bypass the CTE ERP peak.
            </span>
          </div>
          <button
            onClick={() => onOpenSetAlarm('07:15 AM')}
            className="px-2.5 py-1 bg-white border border-[#93c5fd] hover:border-[#60a5fa] text-[#0284c7] rounded-md font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
          >
            Set Alarm
          </button>
        </div>
      </div>

      {/* 3. Route Strategy Comparison */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-display text-slate-900">
            Route Strategy Comparison
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            Morning Work HQ (MBFC)
          </span>
        </div>

        {/* Comparison Cards Side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Express ERP Lane */}
          <div 
            onClick={() => setSelectedStrategy('tollway')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedStrategy === 'tollway'
                ? 'bg-cyan-50/20 border-[#00a8b5] ring-1 ring-[#00a8b5]'
                : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">Express ERP Route</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-cyan-100 text-[#00828c] rounded-md">
                Fastest
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-slate-900 leading-tight">
              28<span className="text-sm font-medium text-slate-500">m</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight mt-1 mb-2">
              Via CTE Express + ERP 2.0 OBU
            </p>
            <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between border-t border-slate-100 pt-1.5 mb-2.5">
              <span>Cost: <strong>S$3.00</strong> ERP</span>
              <span className="text-emerald-600 font-semibold">Save 18 mins</span>
            </div>
            <button 
              className={`w-full py-1 text-xs font-bold rounded-lg transition-colors ${
                selectedStrategy === 'tollway'
                  ? 'bg-[#00a8b5] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Select Express
            </button>
          </div>

          {/* ERP-Free Route */}
          <div 
            onClick={() => setSelectedStrategy('scenic')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedStrategy === 'scenic'
                ? 'bg-cyan-50/20 border-[#00a8b5] ring-1 ring-[#00a8b5]'
                : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">Non-ERP Arterials</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                Free
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-slate-900 leading-tight">
              46<span className="text-sm font-medium text-slate-500">m</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight mt-1 mb-2">
              Via Thomson Rd & Victoria Street
            </p>
            <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between border-t border-slate-100 pt-1.5 mb-2.5">
              <span>Cost: <strong>S$0.00</strong></span>
              <span className="text-rose-600 font-semibold">+18 min delay</span>
            </div>
            <button 
              className={`w-full py-1 text-xs font-bold rounded-lg transition-colors ${
                selectedStrategy === 'scenic'
                  ? 'bg-[#00a8b5] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Select Arterial
            </button>
          </div>
        </div>

        {/* Active Enforcements Along This Path */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Active Enforcements Along This Path
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              2 Camera Checkpoints
            </span>
          </div>

          <div className="space-y-1.5">
            {enforcements.map((enf) => (
              <div 
                key={enf.id}
                className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-800">{enf.location}</div>
                  <div className="text-[11px] text-slate-500">{enf.detail}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  enf.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {enf.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Ready to Roll Callout Banner */}
      <div className="bg-[#006971] text-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
              READY TO ROLL?
            </div>
            <div className="text-sm font-bold font-display">
              Push Route to HUD
            </div>
          </div>
        </div>

        <button
          onClick={onEngageDrive}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#006971] hover:bg-slate-50 active:bg-slate-100 font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Engage Drive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
