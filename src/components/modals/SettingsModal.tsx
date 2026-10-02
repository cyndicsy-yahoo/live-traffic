import React from 'react';
import { X, Settings, Volume2, Shield, Radio, Gauge } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundAlerts: boolean;
  setSoundAlerts: (val: boolean) => void;
  telemetryRate: number;
  setTelemetryRate: (val: number) => void;
  speedUnits: 'mph' | 'kmh';
  setSpeedUnits: (val: 'mph' | 'kmh') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundAlerts,
  setSoundAlerts,
  telemetryRate,
  setTelemetryRate,
  speedUnits,
  setSpeedUnits,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Console Settings
              </h3>
              <p className="text-xs text-slate-500">
                PulseNav telematics & HUD preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Audio Chime */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <div>
                <div className="font-bold text-slate-800">Speed Trap Audio Chimes</div>
                <div className="text-slate-500">Chime 500m ahead of verified mobile radar</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-4 h-4 text-[#00a8b5] rounded"
            />
          </div>

          {/* Telemetry Refresh */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-800">Telemetry Sync Frequency</span>
              </div>
              <span className="font-mono font-bold text-[#00a8b5]">{telemetryRate}s</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={telemetryRate}
              onChange={(e) => setTelemetryRate(Number(e.target.value))}
              className="w-full accent-[#00a8b5]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Ultra-fast (1s)</span>
              <span>Balanced (4s)</span>
              <span>Low-power (10s)</span>
            </div>
          </div>

          {/* Speed Units */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Gauge className="w-4 h-4 text-slate-500" />
              <div>
                <div className="font-bold text-slate-800">Speedometer Metric Units</div>
                <div className="text-slate-500">Display HUD speed in Miles or Kilometers</div>
              </div>
            </div>
            <div className="flex bg-slate-200 p-0.5 rounded-lg font-bold">
              <button
                onClick={() => setSpeedUnits('mph')}
                className={`px-2 py-1 rounded-md transition-all ${
                  speedUnits === 'mph' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                MPH
              </button>
              <button
                onClick={() => setSpeedUnits('kmh')}
                className={`px-2 py-1 rounded-md transition-all ${
                  speedUnits === 'kmh' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                KM/H
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#00a8b5] text-white font-bold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
