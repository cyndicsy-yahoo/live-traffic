import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Navigation, 
  Compass, 
  CornerUpRight, 
  Radio, 
  TriangleAlert,
  Car,
  Video,
  Clock,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { CommuteRoutine, Incident } from '../types';

interface DriverHudViewProps {
  routine: CommuteRoutine;
  onExitHud: () => void;
  onQuickReport: (type: 'accident' | 'speed_check' | 'hazard') => void;
  speedUnits: 'mph' | 'kmh';
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const DriverHudView: React.FC<DriverHudViewProps> = ({
  routine,
  onExitHud,
  onQuickReport,
  speedUnits,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [currentSpeed, setCurrentSpeed] = useState(84);
  const [speedLimit, setSpeedLimit] = useState(90);
  const [radarDistance, setRadarDistance] = useState(1.2);
  const [activeLane, setActiveLane] = useState<number[]>([1, 2]); // lanes 1 & 2
  const [audioBeeping, setAudioBeeping] = useState(false);

  // Speed simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpeed(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = Math.max(76, Math.min(94, prev + delta));
        return next;
      });
      setRadarDistance(prev => {
        if (prev <= 0.1) return 2.4;
        return Number((prev - 0.05).toFixed(2));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const triggerAudioBeep = () => {
    if (!soundEnabled) return;
    setAudioBeeping(true);
    setTimeout(() => setAudioBeeping(false), 800);
  };

  const displaySpeed = speedUnits === 'mph' ? Math.round(currentSpeed * 0.621371) : currentSpeed;
  const displayLimit = speedUnits === 'mph' ? Math.round(speedLimit * 0.621371) : speedLimit;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
      {/* Top HUD Status Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitHud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit HUD</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
              HUD ACTIVE • SINGAPORE ERP 2.0 ONLINE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400">{routine.title}</div>
            <div className="text-[11px] text-[#00a8b5] font-mono">Via CTE Express • ERP Gantry Active</div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-cyan-500/20 text-[#00a8b5] border-cyan-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle TP Radar Audio Chimes"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main HUD Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-6">
        {/* Left Column: Turn Maneuver & Lane Guidance */}
        <div className="lg:col-span-4 space-y-4">
          {/* Turn-by-Turn Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#0284c7]" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0284c7]/20 border border-[#0284c7]/40 flex items-center justify-center text-[#38bdf8] shrink-0">
                <CornerUpRight className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-bold font-display text-white tracking-tight">
                  400 <span className="text-base text-slate-400 font-normal">M</span>
                </div>
                <div className="text-base font-bold text-slate-100 mt-1 leading-snug">
                  Keep Right for Marina Bay / AYE
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Merge toward Exit 1B • CTE Tunnel
                </div>
              </div>
            </div>

            {/* Lane Guidance Visualizer */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Lane Recommendation (LTA Standard)
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((lane) => {
                  const isRecommended = lane === 1 || lane === 2;
                  return (
                    <div
                      key={lane}
                      className={`flex-1 py-2 rounded-lg border text-center font-mono text-xs font-bold transition-all ${
                        isRecommended
                          ? 'bg-[#00a8b5]/20 border-[#00a8b5] text-cyan-300 shadow-sm shadow-[#00a8b5]/20'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
                      }`}
                    >
                      ↑ L{lane}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Speed Camera / Radar Warning */}
          <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Traffic Police Zone Alert
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {radarDistance} KM
              </span>
            </div>

            <div className="text-sm font-bold text-white">
              CTE Chin Swee Tunnel Digital Speed Cam
            </div>
            <div className="text-xs text-indigo-200/70 mt-0.5">
              Enforced limit: <strong className="text-white">80 KM/H</strong> • 2 Scout Verifications
            </div>

            {/* Proximity progress */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.max(10, 100 - (radarDistance / 2.4) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Massive Space Grotesk Speedometer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl relative overflow-hidden backdrop-blur-md">
          {/* Circular glow ambient */}
          <div className="absolute w-72 h-72 rounded-full bg-[#00a8b5]/10 filter blur-3xl pointer-events-none" />

          {/* Speed Limit Shield */}
          <div className="mb-2 bg-white text-slate-950 px-3.5 py-1.5 rounded-lg border-2 border-slate-900 shadow-md flex flex-col items-center">
            <span className="text-[9px] font-extrabold tracking-widest uppercase">SPEED LIMIT</span>
            <span className="text-2xl font-bold font-display leading-none">{displayLimit}</span>
          </div>

          {/* Main Speed Digits */}
          <div className="relative my-2">
            <span className="text-8xl sm:text-9xl font-bold font-display tracking-tighter text-white drop-shadow-lg">
              {displaySpeed}
            </span>
          </div>

          <div className="text-base font-bold font-mono tracking-widest text-[#00a8b5] uppercase">
            {speedUnits.toUpperCase()}
          </div>

          <div className="mt-4 px-3.5 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-xs font-mono text-slate-300">
            Current Flow: Free • Next ERP Gantry in 1.4 km
          </div>
        </div>

        {/* Right Column: Route Metrics & Quick Driver Incident Reporter */}
        <div className="lg:col-span-3 space-y-4">
          {/* Trip Summary Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Telemetry Flight Data
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-[11px] text-slate-400">ETA</div>
                <div className="text-2xl font-bold font-display text-white">08:13</div>
                <div className="text-[10px] text-emerald-400 font-semibold">-4m via CTE Express</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Remaining</div>
                <div className="text-2xl font-bold font-display text-[#00a8b5]">12.4</div>
                <div className="text-[10px] text-slate-400">KM to MBFC</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>Traffic Factor</span>
              <span className="font-bold text-emerald-400 font-mono">OPTIMAL</span>
            </div>
          </div>

          {/* One-Tap Incident Reporting for Drivers */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              One-Tap Scout Broadcast
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onQuickReport('accident')}
                className="flex items-center gap-2 p-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl text-left transition-all cursor-pointer active:scale-95"
              >
                <Car className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-bold text-rose-200">Crash</span>
              </button>

              <button
                onClick={() => onQuickReport('speed_check')}
                className="flex items-center gap-2 p-2.5 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-xl text-left transition-all cursor-pointer active:scale-95"
              >
                <Video className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-bold text-indigo-200">TP Laser</span>
              </button>

              <button
                onClick={() => onQuickReport('hazard')}
                className="flex items-center gap-2 p-2.5 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/60 rounded-xl text-left transition-all cursor-pointer active:scale-95"
              >
                <TriangleAlert className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs font-bold text-sky-200">Debris</span>
              </button>

              <button
                onClick={triggerAudioBeep}
                className="flex items-center gap-2 p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-all cursor-pointer active:scale-95"
              >
                <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">Ping Scout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div>GPS SIGNAL: 0.4M SINGAPORE SLA CORS ACCURACY</div>
        <div className="text-slate-400">AUTOMATIC SPEED ADAPTIVE HUD</div>
      </div>
    </div>
  );
};
