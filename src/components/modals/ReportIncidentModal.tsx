import React, { useState } from 'react';
import { X, TriangleAlert, Car, Video, Wrench, Ban, MapPin, Send } from 'lucide-react';
import { Incident, IncidentType } from '../../types';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Incident) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<IncidentType>('accident');
  const [title, setTitle] = useState('');
  const [highway, setHighway] = useState('CTE Southbound');
  const [description, setDescription] = useState('');
  const [delay, setDelay] = useState('+10 min');
  const [blockedLanes, setBlockedLanes] = useState('Lane 1 & 2');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let badgeLabel = 'Severe Delay';
    let badgeType: 'severe' | 'radar' | 'hazard' | 'closure' = 'severe';

    if (type === 'speed_check') {
      badgeLabel = 'Mobile TP Laser';
      badgeType = 'radar';
    } else if (type === 'hazard') {
      badgeLabel = 'Road Hazard';
      badgeType = 'hazard';
    } else if (type === 'closure') {
      badgeLabel = 'Slip Road Closure';
      badgeType = 'closure';
    }

    const newInc: Incident = {
      id: `user-inc-${Date.now()}`,
      title: title.trim(),
      type,
      badgeLabel,
      badgeType,
      delayText: delay,
      secondaryTag: blockedLanes,
      description: description.trim() || `${blockedLanes} obstructed. Slow-moving queue. Corroborated by LTA EMAS.`,
      confirmations: 1,
      reportedTimeAgo: 'Just now',
      reportedBy: 'You (Singapore Scout)',
      coordinates: [
        1.3200 + (Math.random() - 0.5) * 0.06,
        103.8500 + (Math.random() - 0.5) * 0.08
      ],
      highway,
      votesYes: 1,
      votesCleared: 0,
      userVoted: 'yes',
      isCritical: type === 'accident'
    };

    onSubmit(newInc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <TriangleAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Report Road Incident
              </h3>
              <p className="text-xs text-slate-500">
                Broadcast live telematics to the metropolitan driver network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Incident Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Incident Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setType('accident')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'accident'
                    ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Car className="w-4 h-4 mb-1 text-rose-500" />
                <span>Collision</span>
              </button>

              <button
                type="button"
                onClick={() => setType('speed_check')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'speed_check'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Video className="w-4 h-4 mb-1 text-indigo-500" />
                <span>Radar / Trap</span>
              </button>

              <button
                type="button"
                onClick={() => setType('hazard')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'hazard'
                    ? 'bg-sky-50 border-sky-300 text-sky-700 ring-2 ring-sky-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wrench className="w-4 h-4 mb-1 text-sky-500" />
                <span>Debris / Fix</span>
              </button>

              <button
                type="button"
                onClick={() => setType('closure')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'closure'
                    ? 'bg-slate-100 border-slate-300 text-slate-900 ring-2 ring-slate-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Ban className="w-4 h-4 mb-1 text-slate-600" />
                <span>Closure</span>
              </button>
            </div>
          </div>

          {/* Location Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Specific Location / Junction Title
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. CTE Southbound before Braddell Flyover Exit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5] focus:border-transparent font-medium"
              />
            </div>
          </div>

          {/* Highway & Estimated Delay */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Expressway / Corridor
              </label>
              <select
                value={highway}
                onChange={(e) => setHighway(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5] font-medium"
              >
                <option value="CTE Southbound">CTE Southbound (towards City)</option>
                <option value="CTE Northbound">CTE Northbound (towards SLE)</option>
                <option value="PIE Eastbound">PIE Eastbound (towards Changi)</option>
                <option value="PIE Westbound">PIE Westbound (towards Tuas)</option>
                <option value="AYE Eastbound">AYE Eastbound (towards MCE)</option>
                <option value="AYE Westbound">AYE Westbound (towards Jurong)</option>
                <option value="ECP Eastbound">ECP Eastbound (towards Airport)</option>
                <option value="KPE Southbound">KPE Tunnel (Southbound)</option>
                <option value="BKE Northbound">BKE Northbound (Woodlands)</option>
                <option value="Upper Thomson Rd">Upper Thomson Road</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Delay Impact
              </label>
              <input
                type="text"
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
                placeholder="+10 min"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5] font-medium"
              >
              </input>
            </div>
          </div>

          {/* Lane Blockage Detail */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Obstructed Lanes / Details
            </label>
            <input
              type="text"
              value={blockedLanes}
              onChange={(e) => setBlockedLanes(e.target.value)}
              placeholder="e.g. Left shoulder & lane 1 obstructed"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5] font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Live Observation Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context for scout vehicle corroboration and municipal routing..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8b5] font-medium resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00a8b5] hover:bg-[#00929e] active:bg-[#007c87] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Incident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
