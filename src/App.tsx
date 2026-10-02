/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RotateCw, 
  Calendar, 
  Sparkles, 
  Check, 
  Radio
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MetricCards } from './components/MetricCards';
import { HazardFeed } from './components/HazardFeed';
import { TacticalMap } from './components/TacticalMap';
import { CommuteRoutines } from './components/CommuteRoutines';
import { TrafficCanvasView } from './components/TrafficCanvasView';
import { HazardsAlertsView } from './components/HazardsAlertsView';
import { DriverHudView } from './components/DriverHudView';
import { FleetTelematicsView } from './components/FleetTelematicsView';
import { ReportIncidentModal } from './components/modals/ReportIncidentModal';
import { NewRoutineModal } from './components/modals/NewRoutineModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SetAlarmModal } from './components/modals/SetAlarmModal';
import { 
  INITIAL_INCIDENTS, 
  COMMUTE_ROUTINES, 
  WEEKLY_PATTERNS, 
  ENFORCEMENTS 
} from './data/mockData';
import { 
  ActiveView, 
  Incident, 
  CommuteRoutine 
} from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('route-forecast');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [routines, setRoutines] = useState<CommuteRoutine[]>(COMMUTE_ROUTINES);
  const [selectedRoutine, setSelectedRoutine] = useState<CommuteRoutine>(COMMUTE_ROUTINES[0]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // Tactical State
  const [detourApplied, setDetourApplied] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'tollway' | 'scenic'>('tollway');
  const [scoutCount, setScoutCount] = useState(1420);
  const [syncCountdown, setSyncCountdown] = useState(4);
  const [isSyncing, setIsSyncing] = useState(false);

  // Layer toggles
  const [activeLayer, setActiveLayer] = useState<'standard' | 'satellite'>('standard');
  const [showLayerDropdown, setShowLayerDropdown] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState({
    cameras: true,
    radar: true,
    debris: true,
    tolls: true,
  });

  // Settings
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [telemetryRate, setTelemetryRate] = useState(4);
  const [speedUnits, setSpeedUnits] = useState<'mph' | 'kmh'>('kmh');

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNewRoutineModalOpen, setIsNewRoutineModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [recommendedAlarmTime, setRecommendedAlarmTime] = useState('07:15 AM');

  // Live timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncCountdown(prev => {
        if (prev <= 1) {
          setIsSyncing(true);
          setTimeout(() => setIsSyncing(false), 500);
          return telemetryRate;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [telemetryRate]);

  // Subtle driver count fluctuation
  useEffect(() => {
    const scoutTimer = setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2;
      setScoutCount(prev => Math.max(1390, Math.min(1450, prev + delta)));
    }, 6000);
    return () => clearInterval(scoutTimer);
  }, []);

  const handleVote = (id: string, vote: 'yes' | 'cleared') => {
    setIncidents(prev => prev.map(item => {
      if (item.id === id) {
        if (item.userVoted === vote) return item;
        const newVotesYes = vote === 'yes' ? item.votesYes + 1 : (item.userVoted === 'yes' ? item.votesYes - 1 : item.votesYes);
        const newVotesCleared = vote === 'cleared' ? item.votesCleared + 1 : (item.userVoted === 'cleared' ? item.votesCleared - 1 : item.votesCleared);
        return {
          ...item,
          votesYes: newVotesYes,
          votesCleared: newVotesCleared,
          userVoted: vote,
          confirmations: vote === 'yes' ? item.confirmations + 1 : item.confirmations
        };
      }
      return item;
    }));
  };

  const handleApplyDetour = () => {
    setDetourApplied(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleReportIncident = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);
    setSelectedIncident(newInc);
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }
  };

  const handleAddRoutine = (routine: CommuteRoutine) => {
    setRoutines(prev => [...prev, routine]);
    setSelectedRoutine(routine);
  };

  const handleQuickReportFromHud = (type: 'accident' | 'speed_check' | 'hazard') => {
    const newInc: Incident = {
      id: `hud-inc-${Date.now()}`,
      title: type === 'accident' ? 'Collision on Current Expressway' : type === 'speed_check' ? 'Traffic Police Laser Active' : 'Road Obstruction / Debris',
      type,
      badgeLabel: type === 'accident' ? 'Severe Delay' : type === 'speed_check' ? 'Mobile TP Laser' : 'Road Hazard',
      badgeType: type === 'accident' ? 'severe' : type === 'speed_check' ? 'radar' : 'hazard',
      delayText: type === 'accident' ? '+8 min' : undefined,
      description: 'Quick broadcast pinged directly from Driver HUD connected to Singapore telemetry grid.',
      confirmations: 1,
      reportedTimeAgo: 'Just now',
      reportedBy: 'Driver HUD Scout',
      coordinates: [1.3280, 103.8560],
      highway: 'CTE Southbound',
      votesYes: 1,
      votesCleared: 0,
      userVoted: 'yes'
    };
    handleReportIncident(newInc);
  };

  const toggleLayer = (layerKey: 'cameras' | 'radar' | 'debris' | 'tolls') => {
    setEnabledLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // If in Driver HUD mode, full-screen HUD
  if (activeView === 'driver-hud') {
    return (
      <DriverHudView
        routine={selectedRoutine}
        onExitHud={() => setActiveView('route-forecast')}
        onQuickReport={handleQuickReportFromHud}
        speedUnits={speedUnits}
        soundEnabled={soundAlerts}
        setSoundEnabled={setSoundAlerts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Navigation */}
          <TopNav
            activeView={activeView}
            setActiveView={setActiveView}
            scoutCount={scoutCount}
            onOpenReportIncident={() => setIsReportModalOpen(true)}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            showLayerDropdown={showLayerDropdown}
            setShowLayerDropdown={setShowLayerDropdown}
            enabledLayers={enabledLayers}
            toggleLayer={toggleLayer}
          />

          {/* Sub-view router */}
          <main className="flex-1 overflow-y-auto">
            {activeView === 'traffic-canvas' && (
              <TrafficCanvasView
                incidents={incidents}
                enforcements={ENFORCEMENTS}
                onOpenReportIncident={() => setIsReportModalOpen(true)}
                activeLayer={activeLayer}
              />
            )}

            {activeView === 'hazards-alerts' && (
              <HazardsAlertsView
                incidents={incidents}
                onVote={handleVote}
                onOpenReportIncident={() => setIsReportModalOpen(true)}
              />
            )}

            {activeView === 'fleet-telematics' && (
              <FleetTelematicsView />
            )}

            {activeView === 'route-forecast' && (
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Header Title & Sector Breadcrumb */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    {/* Sector pill */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00a8b5]" />
                      <span className="text-[11px] font-extrabold tracking-widest text-[#00a8b5] uppercase">
                        METROPOLITAN SECTOR • SINGAPORE ISLAND ALPHA
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight leading-tight">
                      Commute Intelligence & Hazards
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Live telemetry, crowd-sourced radar feeds, and algorithmic routine forecasts.
                    </p>
                  </div>

                  {/* Right Header Buttons */}
                  <div className="flex items-center gap-2 self-start md:self-auto">
                    {/* Live Stream Button */}
                    <div className="px-3.5 py-1.5 bg-[#00a8b5] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs cursor-default">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>Live Stream</span>
                    </div>

                    {/* 7-Day Outlook */}
                    <button 
                      onClick={() => setActiveView('hazards-alerts')}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      7-Day Outlook
                    </button>

                    {/* Sync Button */}
                    <button
                      onClick={() => {
                        setIsSyncing(true);
                        setSyncCountdown(telemetryRate);
                        setTimeout(() => setIsSyncing(false), 400);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin text-[#00a8b5]' : ''}`} />
                      <span>Sync ({syncCountdown}s)</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metric Cards */}
                <MetricCards
                  activeIncidentsCount={incidents.length}
                  scoutCount={scoutCount}
                  onInspectAlerts={() => setActiveView('hazards-alerts')}
                />

                {/* Main 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (Hazards Feed + Tactical Map) */}
                  <div className="lg:col-span-7 space-y-6">
                    <HazardFeed
                      incidents={incidents}
                      onVote={handleVote}
                      detourApplied={detourApplied}
                      onApplyDetour={handleApplyDetour}
                      onDismissDetour={() => setDetourApplied(false)}
                      onSelectIncidentOnMap={(inc) => setSelectedIncident(inc)}
                    />

                    {/* Tactical Map Overlay */}
                    <TacticalMap
                      incidents={incidents}
                      enforcements={ENFORCEMENTS}
                      selectedIncident={selectedIncident}
                      routeCoordinates={selectedRoutine.coordinatesRoute}
                      detourApplied={detourApplied}
                      activeLayer={activeLayer}
                    />
                  </div>

                  {/* Right Column (Saved Commute Routines, Weekly Pattern Forecast, Route Strategy Comparison) */}
                  <div className="lg:col-span-5">
                    <CommuteRoutines
                      routines={routines}
                      selectedRoutineId={selectedRoutine.id}
                      onSelectRoutine={(r) => setSelectedRoutine(r)}
                      onNewRoutine={() => setIsNewRoutineModalOpen(true)}
                      weeklyPatterns={WEEKLY_PATTERNS}
                      onOpenSetAlarm={(time) => {
                        setRecommendedAlarmTime(time);
                        setIsAlarmModalOpen(true);
                      }}
                      onEngageDrive={() => setActiveView('driver-hud')}
                      enforcements={ENFORCEMENTS}
                      selectedStrategy={selectedStrategy}
                      setSelectedStrategy={setSelectedStrategy}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportIncident}
      />

      <NewRoutineModal
        isOpen={isNewRoutineModalOpen}
        onClose={() => setIsNewRoutineModalOpen(false)}
        onSubmit={handleAddRoutine}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        soundAlerts={soundAlerts}
        setSoundAlerts={setSoundAlerts}
        telemetryRate={telemetryRate}
        setTelemetryRate={setTelemetryRate}
        speedUnits={speedUnits}
        setSpeedUnits={setSpeedUnits}
      />

      <SetAlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        recommendedTime={recommendedAlarmTime}
      />
    </div>
  );
}
