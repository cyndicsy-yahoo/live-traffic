import React from 'react';
import { 
  Map as MapIcon, 
  GitFork, 
  TriangleAlert, 
  Navigation, 
  Radio, 
  Settings, 
  Activity,
  Layers
} from 'lucide-react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  onOpenSettings 
}) => {
  const navItems = [
    { id: 'traffic-canvas' as ActiveView, label: 'Traffic Canvas', icon: MapIcon },
    { id: 'route-forecast' as ActiveView, label: 'Route Forecast', icon: GitFork },
    { id: 'hazards-alerts' as ActiveView, label: 'Hazards & Alerts', icon: TriangleAlert },
    { id: 'driver-hud' as ActiveView, label: 'Driver HUD', icon: Navigation },
    { id: 'fleet-telematics' as ActiveView, label: 'Fleet Telematics', icon: Radio },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen select-none shrink-0 sticky top-0 z-40">
      <div>
        {/* Brand Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00a8b5] flex items-center justify-center text-white shadow-sm shadow-[#00a8b5]/30">
              <svg 
                className="w-5 h-5 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 16 L8 6 L12 18 L16 8 L20 14" />
              </svg>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold tracking-tight text-[#0f172a] font-display">Pulse</span>
              <span className="text-xl font-medium tracking-tight text-[#00a8b5] font-display">Nav</span>
            </div>
          </div>

          {/* Network Status Pill */}
          <div className="mt-4 px-3 py-1.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-md flex items-center gap-2 text-xs font-semibold text-[#166534]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16a34a]"></span>
            </span>
            <span className="tracking-wide text-[11px]">NETWORK: ONLINE</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-[#00a8b5] text-white shadow-sm shadow-[#00a8b5]/25 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Settings */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* GPS Precision Card */}
        <div className="bg-[#f0f4ff] border border-[#dbeafe] rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">GPS Precision</div>
            <div className="text-xl font-bold font-display text-[#0f172a] leading-none mt-1">0.4m</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#2563eb]">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        {/* Console Settings Link */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-50"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Console Settings</span>
        </button>
      </div>
    </aside>
  );
};
