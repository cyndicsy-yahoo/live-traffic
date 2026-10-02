import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Crosshair, 
  Plus, 
  Minus, 
  Filter, 
  Car, 
  Video, 
  Wrench, 
  Ban, 
  Compass, 
  Activity,
  Maximize2
} from 'lucide-react';
import { Incident, EnforcementCheckpoint } from '../types';

interface TrafficCanvasViewProps {
  incidents: Incident[];
  enforcements: EnforcementCheckpoint[];
  onOpenReportIncident: () => void;
  activeLayer: 'standard' | 'satellite';
}

export const TrafficCanvasView: React.FC<TrafficCanvasViewProps> = ({
  incidents,
  enforcements,
  onOpenReportIncident,
  activeLayer
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [trafficFilter, setTrafficFilter] = useState<'all' | 'severe' | 'radar'>('all');

  const corridors = [
    { name: 'CTE Central Expressway', coords: [1.3280, 103.8560] as [number, number], zoom: 13, speed: '68 KM/H' },
    { name: 'PIE Pan Island Exp', coords: [1.3350, 103.8400] as [number, number], zoom: 13, speed: '72 KM/H' },
    { name: 'AYE Ayer Rajah Exp', coords: [1.3150, 103.7620] as [number, number], zoom: 13, speed: '54 KM/H (Slow)' },
    { name: 'ECP East Coast Pkwy', coords: [1.3030, 103.9210] as [number, number], zoom: 13, speed: '85 KM/H' }
  ];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [1.3200, 103.8500],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    const tileUrl = activeLayer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    // Add traffic flow corridors with realistic Singapore expressway polylines
    // CTE flow (Cyan - Good flow)
    const cteCoords: [number, number][] = [
      [1.3691, 103.8454], // Ang Mo Kio
      [1.3420, 103.8580], // Braddell
      [1.3280, 103.8560], // Toa Payoh
      [1.3170, 103.8510], // Moulmein
      [1.2980, 103.8450], // Cairnhill
      [1.2870, 103.8420], // Chin Swee
      [1.2800, 103.8540], // MBFC
    ];
    L.polyline(cteCoords, { color: '#00a8b5', weight: 6, opacity: 0.85 }).addTo(group);

    // PIE flow (Emerald Green - Free flow)
    const pieCoords: [number, number][] = [
      [1.3320, 103.7430], // Jurong East
      [1.3410, 103.7760], // Jalan Anak Bukit
      [1.3350, 103.8400], // Toa Payoh PIE
      [1.3260, 103.8980], // Paya Lebar
      [1.3350, 103.9500], // Tampines
      [1.3590, 103.9890], // Changi Airport
    ];
    L.polyline(pieCoords, { color: '#10b981', weight: 6, opacity: 0.85 }).addTo(group);

    // AYE flow (Amber/Red - Moderate congestion)
    const ayeCoords: [number, number][] = [
      [1.3200, 103.7300], // Pandan
      [1.3150, 103.7620], // Clementi
      [1.2950, 103.7850], // Buona Vista / NUS
      [1.2750, 103.8200], // Radin Mas
      [1.2700, 103.8450], // Keppel / MCE
    ];
    L.polyline(ayeCoords, { color: '#f59e0b', weight: 6, opacity: 0.85 }).addTo(group);

    // ECP flow (Emerald Green)
    const ecpCoords: [number, number][] = [
      [1.2780, 103.8600], // Marina South
      [1.2980, 103.8780], // Marina East
      [1.3030, 103.9210], // Bedok / East Coast
      [1.3590, 103.9890], // Changi
    ];
    L.polyline(ecpCoords, { color: '#10b981', weight: 6, opacity: 0.85 }).addTo(group);

    // Incidents
    incidents.forEach((inc) => {
      if (trafficFilter === 'severe' && inc.type !== 'accident') return;
      if (trafficFilter === 'radar' && inc.type !== 'speed_check') return;

      let color = '#ef4444';
      if (inc.type === 'speed_check') color = '#6366f1';
      if (inc.type === 'hazard') color = '#0284c7';
      if (inc.type === 'closure') color = '#475569';

      const icon = L.divIcon({
        className: 'custom-traffic-pin',
        html: `
          <div style="background-color: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; cursor: pointer;">
            ${inc.type === 'speed_check' ? '📷' : inc.type === 'accident' ? '💥' : '⚠️'}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker(inc.coordinates, { icon });
      marker.on('click', () => setSelectedIncident(inc));
      group.addLayer(marker);
    });
  }, [incidents, trafficFilter]);

  const jumpToCorridor = (coords: [number, number], zoom: number) => {
    mapInstanceRef.current?.flyTo(coords, zoom, { duration: 1 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden select-none">
      {/* Map Element */}
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* Top Floating Corridor Navigator */}
      <div className="absolute top-4 left-6 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-200 flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase px-2">Corridors:</span>
          {corridors.map((c) => (
            <button
              key={c.name}
              onClick={() => jumpToCorridor(c.coords, c.zoom)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{c.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">({c.speed})</span>
            </button>
          ))}
        </div>

        {/* Filter Pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-slate-200 flex items-center gap-1">
          <button
            onClick={() => setTrafficFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              trafficFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Corridors
          </button>
          <button
            onClick={() => setTrafficFilter('severe')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              trafficFilter === 'severe' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Severe (Red)
          </button>
          <button
            onClick={() => setTrafficFilter('radar')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              trafficFilter === 'radar' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Speed Traps
          </button>
        </div>
      </div>

      {/* Selected Incident Drawer / Overlay */}
      {selectedIncident && (
        <div className="absolute bottom-6 left-6 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                selectedIncident.type === 'accident'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                {selectedIncident.badgeLabel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedIncident.coordinates[0].toFixed(3)}, {selectedIncident.coordinates[1].toFixed(3)}
              </span>
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <h4 className="text-sm font-bold font-display text-slate-900 mt-2">
            {selectedIncident.title}
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            {selectedIncident.description}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">{selectedIncident.confirmations} Scouts Confirmed</span>
            <button
              onClick={() => {
                mapInstanceRef.current?.flyTo(selectedIncident.coordinates, 15);
              }}
              className="font-bold text-[#00a8b5] hover:text-[#00828c]"
            >
              Zoom In Details
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md border border-slate-200 text-xs space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Expressway Speed Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-[#10b981]" />
          <span className="text-slate-600">&gt; 80 KM/H (Normal Flow)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-[#00a8b5]" />
          <span className="text-slate-600">60 - 80 KM/H (ERP Zone Flow)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-[#f59e0b]" />
          <span className="text-slate-600">40 - 60 KM/H (Moderate Delay)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1.5 rounded-full bg-[#ef4444]" />
          <span className="text-slate-600">&lt; 40 KM/H (Severe Congestion)</span>
        </div>
      </div>
    </div>
  );
};
