import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Crosshair, Plus, Minus, ShieldAlert, Video, Car, Camera, Zap } from 'lucide-react';
import { Incident, EnforcementCheckpoint } from '../types';

interface TacticalMapProps {
  incidents: Incident[];
  enforcements: EnforcementCheckpoint[];
  selectedIncident?: Incident | null;
  routeCoordinates?: [number, number][];
  detourApplied?: boolean;
  activeLayer?: 'standard' | 'satellite';
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  incidents,
  enforcements,
  selectedIncident,
  routeCoordinates,
  detourApplied = false,
  activeLayer = 'standard'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const detourPolylineRef = useRef<L.Polyline | null>(null);

  const [zoomLevel, setZoomLevel] = useState(12);
  const [currentCenter, setCurrentCenter] = useState({ lat: 1.3200, lng: 103.8500 });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Singapore Central Expressway / Marina Bay corridor
    const map = L.map(mapContainerRef.current, {
      center: [1.3200, 103.8500],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // CartoDB Positron clean light tiles
    const tileUrl = activeLayer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    map.on('moveend', () => {
      const c = map.getCenter();
      setCurrentCenter({ lat: c.lat, lng: c.lng });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer if activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = activeLayer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [activeLayer]);

  // Render Route and Incidents
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Default Singapore CTE to MBFC Route
    const defaultRoute: [number, number][] = routeCoordinates && routeCoordinates.length > 0
      ? routeCoordinates
      : [
          [1.3691, 103.8454], // Ang Mo Kio
          [1.3420, 103.8580], // CTE Braddell
          [1.3280, 103.8560], // CTE Toa Payoh
          [1.3170, 103.8510], // CTE Moulmein
          [1.2980, 103.8450], // CTE Cairnhill Tunnel
          [1.2870, 103.8420], // Chin Swee Road
          [1.2800, 103.8540], // Marina Bay Financial Centre (MBFC)
        ];

    // Detour alternative route via Marymount / Thomson Rd if applied
    const detourPath: [number, number][] = [
      [1.3691, 103.8454], // Ang Mo Kio
      [1.3550, 103.8350], // Marymount Road bypass
      [1.3300, 103.8400], // Thomson Road
      [1.3000, 103.8430], // Bras Basah / Bencoolen
      [1.2800, 103.8540], // Rejoin MBFC
    ];

    // Main Route Glow
    const routeGlow = L.polyline(defaultRoute, {
      color: '#00a8b5',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    });
    layerGroup.addLayer(routeGlow);

    // Main Route Line
    const routeLine = L.polyline(defaultRoute, {
      color: detourApplied ? '#94a3b8' : '#00a8b5',
      weight: 5,
      opacity: 0.95,
      dashArray: detourApplied ? '6, 6' : undefined,
      lineCap: 'round',
      lineJoin: 'round',
    });
    layerGroup.addLayer(routeLine);

    if (detourApplied) {
      const detourGlow = L.polyline(detourPath, {
        color: '#10b981',
        weight: 8,
        opacity: 0.4,
        lineCap: 'round',
      });
      const detourLine = L.polyline(detourPath, {
        color: '#10b981',
        weight: 5,
        opacity: 1,
        lineCap: 'round',
      });
      layerGroup.addLayer(detourGlow);
      layerGroup.addLayer(detourLine);
    }

    // Origin Marker (Ang Mo Kio)
    const originIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background-color: #00a8b5; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
    const originMarker = L.marker(defaultRoute[0], { icon: originIcon });
    originMarker.bindTooltip('Origin: Ang Mo Kio Ave 1', { permanent: false, direction: 'top' });
    layerGroup.addLayer(originMarker);

    // Destination Marker (Marina Bay Financial Centre)
    const destIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background-color: #0f172a; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #00a8b5; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <div style="width: 5px; height: 5px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    const destMarker = L.marker(defaultRoute[defaultRoute.length - 1], { icon: destIcon });
    destMarker.bindTooltip('Destination: Marina Bay Financial Centre (MBFC)', { permanent: false, direction: 'top' });
    layerGroup.addLayer(destMarker);

    // Add Incident Markers
    incidents.forEach((inc) => {
      let iconColor = '#ef4444';
      let iconSymbol = '!';
      if (inc.type === 'speed_check') {
        iconColor = '#6366f1';
        iconSymbol = '📷';
      } else if (inc.type === 'hazard') {
        iconColor = '#0284c7';
        iconSymbol = '⚠️';
      } else if (inc.type === 'closure') {
        iconColor = '#64748b';
        iconSymbol = '⛔';
      }

      const incidentIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: `
          <div style="background-color: ${iconColor}; color: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; cursor: pointer;">
            ${iconSymbol}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(inc.coordinates, { icon: incidentIcon });
      marker.bindPopup(`
        <div style="font-family: 'Manrope', sans-serif; min-width: 180px; padding: 2px;">
          <div style="font-size: 11px; font-weight: bold; color: ${iconColor}; text-transform: uppercase;">${inc.badgeLabel}</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 2px 0;">${inc.title}</div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${inc.description}</div>
          <div style="font-size: 10px; color: #64748b; font-weight: 600;">Confirmations: ${inc.confirmations} drivers</div>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    // Add Enforcement Checkpoints
    enforcements.forEach((enf) => {
      const enfIcon = L.divIcon({
        className: 'custom-enf-marker',
        html: `
          <div style="background-color: #3b82f6; color: white; width: 22px; height: 22px; border-radius: 6px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">
            RAD
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker(enf.coordinates, { icon: enfIcon });
      marker.bindTooltip(`Radar: ${enf.location}`, { direction: 'top' });
      layerGroup.addLayer(marker);
    });

  }, [incidents, enforcements, routeCoordinates, detourApplied]);

  // Center on selected incident if prop changes
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedIncident.coordinates, 14, { duration: 1.2 });
    }
  }, [selectedIncident]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([1.3200, 103.8500], 12, { duration: 0.8 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs mt-6">
      {/* Map Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-700">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
          </div>
          <h3 className="text-base font-bold font-display text-slate-900">
            Tactical Hazard Overlay
          </h3>
        </div>

        <div className="text-xs font-mono text-slate-500 font-medium">
          Live Coordinates: {currentCenter.lat.toFixed(4)}° N, {currentCenter.lng.toFixed(4)}° E (Singapore SGT)
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-80 sm:h-96">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top-Left Floating Tactical Telemetry Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="px-3 py-1.5 bg-slate-900/90 text-white rounded-lg text-xs font-bold tracking-wide shadow-md backdrop-blur-xs flex items-center gap-2 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CTE CORRIDOR • LIVE 30 FPS</span>
          </div>
          <div className="px-3 py-1 bg-white/95 text-slate-800 rounded-lg text-xs font-semibold shadow-sm backdrop-blur-xs flex items-center gap-2 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#00a8b5]" />
            <span>ERP 2.0 Active • Flow 68 KM/H</span>
          </div>
        </div>

        {/* Bottom Right Floating Controls */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-2 text-slate-700 hover:bg-slate-50 border-r border-slate-200 transition-colors"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Recenter Map Button */}
          <button
            onClick={handleRecenter}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#00a8b5] hover:bg-[#00929e] active:bg-[#007c87] text-white rounded-lg shadow-md text-xs font-bold transition-all cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Recenter Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
