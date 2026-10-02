export type IncidentType = 'accident' | 'speed_check' | 'hazard' | 'closure';

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  badgeLabel: string;
  badgeType: 'severe' | 'radar' | 'hazard' | 'closure' | 'warning';
  delayText?: string;
  speedLimitText?: string;
  secondaryTag?: string;
  description: string;
  confirmations: number;
  reportedTimeAgo: string;
  reportedBy: string;
  coordinates: [number, number]; // [lat, lng]
  highway: string;
  votesYes: number;
  votesCleared: number;
  userVoted?: 'yes' | 'cleared';
  isCritical?: boolean;
}

export interface CommuteRoutine {
  id: string;
  title: string;
  iconType: 'work' | 'fitness' | 'airport' | 'custom';
  origin: string;
  destination: string;
  distance: string;
  durationMinutes: number;
  durationFormatted: string;
  optimalDepart: string;
  tags: {
    label: string;
    variant: 'default' | 'danger' | 'success' | 'indigo' | 'warning';
  }[];
  tollCost: string;
  speedTrapsCount: number;
  detourAvailable?: boolean;
  coordinatesRoute: [number, number][];
}

export interface WeeklyPatternDay {
  day: string;
  shortDay: string;
  morningMinutes: number;
  eveningMinutes: number;
  delayIndex: number;
}

export interface EnforcementCheckpoint {
  id: string;
  location: string;
  detail: string;
  status: 'Active' | 'Scout Confirmed' | 'Standby';
  coordinates: [number, number];
  type: 'camera' | 'radar' | 'red_light';
}

export interface ScoutVehicle {
  id: string;
  callsign: string;
  driverName: string;
  vehicleType: string;
  lat: number;
  lng: number;
  speedMph: number;
  status: 'patrolling' | 'verifying' | 'idle';
  pingsPerSec: number;
  lastReport: string;
}

export type ActiveView = 
  | 'traffic-canvas'
  | 'route-forecast'
  | 'hazards-alerts'
  | 'driver-hud'
  | 'fleet-telematics';
