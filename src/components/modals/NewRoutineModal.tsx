import React, { useState } from 'react';
import { X, Briefcase, Plus, MapPin, Clock } from 'lucide-react';
import { CommuteRoutine } from '../../types';

interface NewRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (routine: CommuteRoutine) => void;
}

export const NewRoutineModal: React.FC<NewRoutineModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [optimalDepart, setOptimalDepart] = useState('08:00');
  const [iconType, setIconType] = useState<'work' | 'fitness' | 'airport' | 'custom'>('work');
  const [tollCost, setTollCost] = useState('$0.00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !origin || !destination) return;

    const newRoutine: CommuteRoutine = {
      id: `routine-${Date.now()}`,
      title,
      iconType,
      origin,
      destination,
      distance: '14.2 km',
      durationMinutes: 26,
      durationFormatted: '26m',
      optimalDepart,
      tags: [
        { label: tollCost !== 'S$0.00' ? `ERP: ${tollCost}` : 'Non-ERP Flow', variant: 'default' },
        { label: 'All clear', variant: 'success' }
      ],
      tollCost,
      speedTrapsCount: 0,
      detourAvailable: false,
      coordinatesRoute: [
        [1.3521, 103.8198],
        [1.2800, 103.8540]
      ]
    };

    onSubmit(newRoutine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#00a8b5] flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                New Commute Routine
              </h3>
              <p className="text-xs text-slate-500">
                Configure routine for predictive traffic modeling
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Routine Label
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Marina Bay Financial Centre, One-North, Changi T2"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Origin
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Home (Ang Mo Kio / Bishan)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Destination
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Raffles Place / MBFC"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Optimal Depart Window
              </label>
              <input
                type="text"
                value={optimalDepart}
                onChange={(e) => setOptimalDepart(e.target.value)}
                placeholder="07:45"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Expected ERP 2.0 Fee
              </label>
              <input
                type="text"
                value={tollCost}
                onChange={(e) => setTollCost(e.target.value)}
                placeholder="S$3.00"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00a8b5] hover:bg-[#00929e] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Routine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
