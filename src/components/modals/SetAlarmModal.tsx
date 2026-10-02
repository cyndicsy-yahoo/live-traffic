import React, { useState } from 'react';
import { X, Bell, Clock, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SetAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedTime: string;
}

export const SetAlarmModal: React.FC<SetAlarmModalProps> = ({
  isOpen,
  onClose,
  recommendedTime,
}) => {
  const [alarmTime, setAlarmTime] = useState(recommendedTime || '07:15 AM');
  const [leadTime, setLeadTime] = useState('15 mins before');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Departure Alarm
              </h3>
              <p className="text-xs text-slate-500">
                AI Commute Window Reminder
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

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 text-xs text-slate-700">
            <div className="font-bold text-sky-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              Smart Peak Bypass (Singapore SGT)
            </div>
            Departing at <strong>{alarmTime}</strong> avoids the Wednesday morning CTE corridor choke point before Braddell and saves approximately 21 minutes.
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Alarm Time
            </label>
            <input
              type="text"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="w-full px-3 py-2 text-base font-display font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Notification Lead
            </label>
            <select
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5]"
            >
              <option value="10 mins before">10 mins before departure</option>
              <option value="15 mins before">15 mins before departure</option>
              <option value="30 mins before">30 mins before departure</option>
              <option value="Exact time">At exact departure time</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition-all ${
                saved ? 'bg-emerald-600' : 'bg-[#00a8b5] hover:bg-[#00929e]'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              <span>{saved ? 'Alarm Activated!' : 'Save Alarm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
