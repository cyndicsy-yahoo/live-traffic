import React from 'react';
import { TriangleAlert, Radio, Clock, Gauge, ArrowUp } from 'lucide-react';

interface MetricCardsProps {
  activeIncidentsCount: number;
  scoutCount: number;
  onInspectAlerts: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  activeIncidentsCount,
  scoutCount,
  onInspectAlerts
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* 1. Active Road Alerts */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            ACTIVE ROAD ALERTS
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
            <TriangleAlert className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold font-display text-slate-900 tracking-tight">
            {activeIncidentsCount}
          </span>
          <span className="text-xs font-semibold text-rose-600 flex items-center">
            <ArrowUp className="w-3 h-3 mr-0.5" /> +3 last 15m
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>5 major • 13 minor slows</span>
          <button 
            onClick={onInspectAlerts}
            className="text-[#00a8b5] hover:text-[#00828c] font-semibold transition-colors cursor-pointer"
          >
            Inspect
          </button>
        </div>
      </div>

      {/* 2. Active Scouts in Net */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            ACTIVE SCOUTS IN NET
          </span>
          <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#00a8b5]">
            <Radio className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold font-display text-slate-900 tracking-tight">
            {scoutCount.toLocaleString()}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 bg-cyan-50 text-[#00828c] border border-cyan-200/60 rounded-full">
            High Density
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>99.4% route node coverage</span>
          <span className="font-medium text-slate-600">92.4 msg/s</span>
        </div>
      </div>

      {/* 3. Avg Commute Delay */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            AVG COMMUTE DELAY
          </span>
          <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold font-display text-[#0284c7] tracking-tight">
            +6.2m
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200/70 rounded-full">
            Optimized Detours
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>vs +14.8m without routing</span>
          <span className="font-semibold text-emerald-600">-58% loss</span>
        </div>
      </div>

      {/* 4. Free-Flow Velocity Index */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            FREE-FLOW VELOCITY INDEX
          </span>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Gauge className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold font-display text-slate-900 tracking-tight">
            87%
          </span>
          <span className="text-xs font-semibold text-slate-500">
            ~Steady
          </span>
        </div>

        {/* Progress bar line with indicator dot */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full relative mb-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-[#00a8b5] to-[#0284c7] rounded-full" 
            style={{ width: '87%' }} 
          />
        </div>

        <div className="flex items-center justify-end text-xs text-slate-500 pt-0.5">
          <span className="font-semibold text-slate-700">Normal</span>
        </div>
      </div>
    </div>
  );
};
