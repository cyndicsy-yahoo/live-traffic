import React from 'react';
import { 
  Search, 
  Layers, 
  Globe, 
  PlusCircle, 
  Users,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ActiveView } from '../types';

interface TopNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  scoutCount: number;
  onOpenReportIncident: () => void;
  activeLayer: 'standard' | 'satellite';
  setActiveLayer: (layer: 'standard' | 'satellite') => void;
  showLayerDropdown: boolean;
  setShowLayerDropdown: (show: boolean) => void;
  enabledLayers: {
    cameras: boolean;
    radar: boolean;
    debris: boolean;
    tolls: boolean;
  };
  toggleLayer: (layerKey: 'cameras' | 'radar' | 'debris' | 'tolls') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  setActiveView,
  scoutCount,
  onOpenReportIncident,
  activeLayer,
  setActiveLayer,
  showLayerDropdown,
  setShowLayerDropdown,
  enabledLayers,
  toggleLayer,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Search / Mode Selector */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search expressway (CTE, PIE, AYE) or exit..."
            className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-[#00a8b5] focus:bg-white text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveView('traffic-canvas')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeView === 'traffic-canvas'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Traffic Map
          </button>
          <button
            onClick={() => setActiveView('route-forecast')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeView === 'route-forecast'
                ? 'bg-[#00a8b5] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Commute Forecast & Route
          </button>
        </div>
      </div>

      {/* Middle Telemetry Pill */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-medium text-slate-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>
          Live Telemetry Active • <strong className="font-semibold text-slate-900">{scoutCount.toLocaleString()} Singapore Scouts</strong>
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Layers Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerDropdown(!showLayerDropdown)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              showLayerDropdown 
                ? 'bg-slate-100 text-slate-900 border-slate-300' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Layers</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Layer toggle popover */}
          {showLayerDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 p-2.5 z-50 text-xs space-y-1">
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] px-2 py-1">
                Tactical Overlays
              </div>
              <label className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <span className="font-medium text-slate-700">TP Speed Cameras</span>
                <input 
                  type="checkbox" 
                  checked={enabledLayers.cameras} 
                  onChange={() => toggleLayer('cameras')}
                  className="rounded text-[#00a8b5] focus:ring-0" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <span className="font-medium text-slate-700">Mobile TP Lasers</span>
                <input 
                  type="checkbox" 
                  checked={enabledLayers.radar} 
                  onChange={() => toggleLayer('radar')}
                  className="rounded text-[#00a8b5] focus:ring-0" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <span className="font-medium text-slate-700">Tree / Road Debris</span>
                <input 
                  type="checkbox" 
                  checked={enabledLayers.debris} 
                  onChange={() => toggleLayer('debris')}
                  className="rounded text-[#00a8b5] focus:ring-0" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <span className="font-medium text-slate-700">ERP 2.0 Gantries</span>
                <input 
                  type="checkbox" 
                  checked={enabledLayers.tolls} 
                  onChange={() => toggleLayer('tolls')}
                  className="rounded text-[#00a8b5] focus:ring-0" 
                />
              </label>
            </div>
          )}
        </div>

        {/* Satellite View Toggle */}
        <button
          onClick={() => setActiveLayer(activeLayer === 'standard' ? 'satellite' : 'standard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
            activeLayer === 'satellite'
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{activeLayer === 'satellite' ? 'Street View' : 'Satellite View'}</span>
        </button>

        {/* Report Incident CTA */}
        <button
          onClick={onOpenReportIncident}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#00a8b5] hover:bg-[#00929e] active:bg-[#007c87] text-white rounded-lg shadow-sm transition-all shadow-[#00a8b5]/20 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Incident</span>
        </button>
      </div>
    </header>
  );
};
