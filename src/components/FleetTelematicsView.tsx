import React, { useState } from 'react';
import { 
  Radio, 
  Activity, 
  Wifi, 
  ShieldCheck, 
  Zap, 
  Send, 
  RefreshCw,
  Cpu,
  Navigation
} from 'lucide-react';
import { FLEET_SCOUTS } from '../data/mockData';
import { ScoutVehicle } from '../types';

export const FleetTelematicsView: React.FC = () => {
  const [scouts, setScouts] = useState<ScoutVehicle[]>(FLEET_SCOUTS);
  const [pingLog, setPingLog] = useState<string[]>([
    '08:14:02 - Scout #882 (ComfortDelGro): CTE Braddell congestion verify packet sent',
    '08:14:00 - Scout #412 (Grab Fleet): Upper Thomson 60 KM/H TP laser point confirmed',
    '08:13:58 - Scout #309 (LTA EMAS): Tree debris clearance broadcast to LTA EMAS grid',
    '08:13:55 - Node SG-Central-4: SLA CORS differential GNSS synced'
  ]);

  const handleSimulatePing = () => {
    const timestamp = new Date().toLocaleTimeString();
    const scout = scouts[Math.floor(Math.random() * scouts.length)];
    const newLog = `${timestamp} - ${scout.callsign}: Velocity ${scout.speedMph} km/h - Singapore mesh node acknowledged`;
    setPingLog(prev => [newLog, ...prev.slice(0, 7)]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              SINGAPORE LTA EMAS & SCOUT GRID • 1,420 ACTIVE VEHICLES
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Fleet Telematics & Scout Network (Singapore)
          </h1>
          <p className="text-xs text-slate-500">
            Real-time low-latency telemetry feeds from equipped Singapore taxis, ride-hailing scouts, and LTA EMAS recovery units.
          </p>
        </div>

        <button
          onClick={handleSimulatePing}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 text-[#00a8b5]" />
          <span>Simulate Scout Ping</span>
        </button>
      </div>

      {/* Grid KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Throughput Rate</div>
          <div className="text-2xl font-bold font-display text-slate-900 mt-1">92.4 <span className="text-xs text-slate-400 font-normal">msg/s</span></div>
          <div className="text-xs text-emerald-600 mt-1">● Nominal island-wide grid</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Route Node Coverage</div>
          <div className="text-2xl font-bold font-display text-[#00a8b5] mt-1">99.4%</div>
          <div className="text-xs text-slate-500 mt-1">1,940 Singapore road segments</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Network Latency (RTT)</div>
          <div className="text-2xl font-bold font-display text-slate-900 mt-1">14.2 <span className="text-xs text-slate-400 font-normal">ms</span></div>
          <div className="text-xs text-emerald-600 mt-1">Singapore Edge 5G / DSRC</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Verification Quorum</div>
          <div className="text-2xl font-bold font-display text-indigo-600 mt-1">3 Scouts</div>
          <div className="text-xs text-slate-500 mt-1">Auto-promotes alert to HUD</div>
        </div>
      </div>

      {/* Scout Vehicle Roster */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold font-display text-slate-900">
            Active Scout Vehicle Roster (Singapore Island Sector)
          </h3>
          <span className="text-xs text-slate-500 font-mono">4 Featured Field Units</span>
        </div>

        <div className="divide-y divide-slate-100">
          {scouts.map((scout) => (
            <div key={scout.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold font-mono text-xs">
                  {scout.id.replace('scout-', '#')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{scout.callsign}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scout.status === 'verifying'
                        ? 'bg-rose-100 text-rose-800'
                        : scout.status === 'patrolling'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {scout.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {scout.vehicleType} • Driver: {scout.driverName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-600 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Speed</span>
                  <strong className="text-slate-900 font-display text-sm">{scout.speedMph} km/h</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Telemetry Ping</span>
                  <strong className="text-slate-900 font-display text-sm">{scout.pingsPerSec} /s</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Last Report</span>
                  <span className="text-slate-700 truncate max-w-[140px] block">{scout.lastReport}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Telemetry Ping Stream */}
      <div className="bg-slate-950 text-slate-300 rounded-xl p-4 font-mono text-xs border border-slate-800 shadow-md">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 mb-2 font-sans font-bold text-xs uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Singapore LTA EMAS Telemetry Packet Log</span>
          </div>
          <span className="text-slate-500 font-mono">Port 9002 (WSS)</span>
        </div>
        <div className="space-y-1">
          {pingLog.map((log, idx) => (
            <div key={idx} className="leading-relaxed text-slate-300 flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
