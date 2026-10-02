import { Incident, CommuteRoutine, WeeklyPatternDay, EnforcementCheckpoint, ScoutVehicle } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-sg-101',
    title: 'CTE Southbound after Braddell Flyover',
    type: 'accident',
    badgeLabel: 'Severe Delay',
    badgeType: 'severe',
    delayText: '+14 min',
    secondaryTag: 'Avg speed 18 km/h',
    description: 'Right shoulder and Lane 1 obstructed. LTA EMAS recovery tow truck dispatched. Stationary queue stretches to Ang Mo Kio Ave 1.',
    confirmations: 42,
    reportedTimeAgo: '4m ago',
    reportedBy: 'EMAS Scout #882',
    coordinates: [1.3420, 103.8580],
    highway: 'CTE Southbound',
    votesYes: 42,
    votesCleared: 2,
    isCritical: true,
  },
  {
    id: 'inc-sg-102',
    title: 'Upper Thomson Road at Springleaf Pass',
    type: 'speed_check',
    badgeLabel: 'Mobile TP Laser',
    badgeType: 'radar',
    speedLimitText: '60 KM/H',
    secondaryTag: 'TP Zone Enforcement',
    description: 'Traffic Police laser operator stationed at pedestrian overhead bridge turnout. Limit: 60 KM/H enforced strictly.',
    confirmations: 89,
    reportedTimeAgo: '9m ago',
    reportedBy: 'Taxi Scout #412',
    coordinates: [1.3960, 103.8180],
    highway: 'Upper Thomson Rd',
    votesYes: 89,
    votesCleared: 5,
  },
  {
    id: 'inc-sg-103',
    title: 'PIE Westbound • Near Jalan Anak Bukit Flyover',
    type: 'hazard',
    badgeLabel: 'Tree Debris',
    badgeType: 'hazard',
    delayText: '+5 min',
    secondaryTag: 'Caution Advised',
    description: 'Fallen tree branch across center chevron divider following heavy monsoon rain. Vehicles making sudden evasive lane shifts.',
    confirmations: 19,
    reportedTimeAgo: '14m ago',
    reportedBy: 'Scout #309',
    coordinates: [1.3410, 103.7760],
    highway: 'PIE Westbound',
    votesYes: 19,
    votesCleared: 1,
  },
  {
    id: 'inc-sg-104',
    title: 'KPE Tunnel Southbound Entry Slip Road',
    type: 'closure',
    badgeLabel: 'Planned Closure',
    badgeType: 'closure',
    delayText: 'Closed',
    secondaryTag: 'Until 2:00 PM',
    description: 'LTA tunnel ventilation maintenance until 14:00 SGT. Use Nicoll Highway or ECP as alternative entry into Marina Bay.',
    confirmations: 34,
    reportedTimeAgo: '22m ago',
    reportedBy: 'LTA EMAS Verified Feed',
    coordinates: [1.3050, 103.8730],
    highway: 'KPE Southbound',
    votesYes: 34,
    votesCleared: 0,
  },
  {
    id: 'inc-sg-105',
    title: 'AYE Eastbound before Clementi Ave 6',
    type: 'accident',
    badgeLabel: 'Moderate Congestion',
    badgeType: 'warning',
    delayText: '+8 min',
    secondaryTag: 'Avg speed 32 km/h',
    description: 'Two-car fender bender shifted to side road shoulder. Slow-moving traffic from Jurong Town Hall Road.',
    confirmations: 27,
    reportedTimeAgo: '16m ago',
    reportedBy: 'Scout #771',
    coordinates: [1.3150, 103.7620],
    highway: 'AYE Eastbound',
    votesYes: 27,
    votesCleared: 3,
  },
  {
    id: 'inc-sg-106',
    title: 'BKE Northbound towards Woodlands Checkpoint',
    type: 'speed_check',
    badgeLabel: 'TP Speed Camera',
    badgeType: 'radar',
    speedLimitText: '90 KM/H',
    secondaryTag: 'Fixed Digital Cam',
    description: 'Automated digital speed enforcement camera active near Dairy Farm exit towards Causeway.',
    confirmations: 63,
    reportedTimeAgo: '30m ago',
    reportedBy: 'Scout #114',
    coordinates: [1.3650, 103.7740],
    highway: 'BKE Northbound',
    votesYes: 63,
    votesCleared: 7,
  }
];

export const COMMUTE_ROUTINES: CommuteRoutine[] = [
  {
    id: 'routine-work',
    title: 'Morning Work HQ (MBFC)',
    iconType: 'work',
    origin: 'Ang Mo Kio',
    destination: 'Marina Bay Financial Centre',
    distance: '16.8 km',
    durationMinutes: 28,
    durationFormatted: '28m',
    optimalDepart: '07:45',
    tags: [
      { label: 'ERP 2.0: S$3.00', variant: 'default' },
      { label: '2 TP Speed Cameras', variant: 'indigo' },
      { label: 'CTE Detour Rec.', variant: 'danger' }
    ],
    tollCost: 'S$3.00',
    speedTrapsCount: 2,
    detourAvailable: true,
    coordinatesRoute: [
      [1.3691, 103.8454], // Ang Mo Kio
      [1.3420, 103.8580], // CTE Braddell
      [1.3280, 103.8560], // CTE Toa Payoh
      [1.3170, 103.8510], // CTE Moulmein
      [1.2980, 103.8450], // CTE Cairnhill Tunnel
      [1.2870, 103.8420], // Chin Swee Road
      [1.2800, 103.8540], // Marina Bay Financial Centre (MBFC)
    ]
  },
  {
    id: 'routine-fitness',
    title: 'Pulse Fitness Marina Bay',
    iconType: 'fitness',
    origin: 'Tiong Bahru',
    destination: 'Marina Barrage & Bay South',
    distance: '7.4 km',
    durationMinutes: 14,
    durationFormatted: '14m',
    optimalDepart: '06:30',
    tags: [
      { label: 'All clear', variant: 'success' },
      { label: 'Non-ERP Arterials', variant: 'default' }
    ],
    tollCost: 'S$0.00',
    speedTrapsCount: 0,
    detourAvailable: false,
    coordinatesRoute: [
      [1.2860, 103.8270], // Tiong Bahru
      [1.2760, 103.8410], // Tanjong Pagar / Anson Rd
      [1.2810, 103.8640], // Marina Barrage
    ]
  },
  {
    id: 'routine-airport',
    title: 'Changi Airport Terminal 2',
    iconType: 'airport',
    origin: 'Novena',
    destination: 'Changi Airport T2',
    distance: '21.5 km',
    durationMinutes: 24,
    durationFormatted: '24m',
    optimalDepart: '14:15',
    tags: [
      { label: 'PIE Express', variant: 'default' },
      { label: 'S$1.50 ERP Gantry', variant: 'default' }
    ],
    tollCost: 'S$1.50',
    speedTrapsCount: 1,
    detourAvailable: false,
    coordinatesRoute: [
      [1.3200, 103.8430], // Novena
      [1.3270, 103.8740], // PIE Woodsville
      [1.3320, 103.9200], // PIE Eunos / Bedok
      [1.3590, 103.9890], // Changi Airport T2
    ]
  }
];

export const WEEKLY_PATTERNS: WeeklyPatternDay[] = [
  { day: 'Monday', shortDay: 'Mon', morningMinutes: 34, eveningMinutes: 42, delayIndex: 1.2 },
  { day: 'Tuesday', shortDay: 'Tue', morningMinutes: 44, eveningMinutes: 48, delayIndex: 1.5 },
  { day: 'Wednesday', shortDay: 'Wed', morningMinutes: 48, eveningMinutes: 54, delayIndex: 1.8 },
  { day: 'Thursday', shortDay: 'Thu', morningMinutes: 42, eveningMinutes: 46, delayIndex: 1.4 },
  { day: 'Friday', shortDay: 'Fri', morningMinutes: 40, eveningMinutes: 58, delayIndex: 1.6 },
  { day: 'Saturday', shortDay: 'Sat', morningMinutes: 20, eveningMinutes: 26, delayIndex: 0.7 },
  { day: 'Sunday', shortDay: 'Sun', morningMinutes: 16, eveningMinutes: 22, delayIndex: 0.5 },
];

export const ENFORCEMENTS: EnforcementCheckpoint[] = [
  {
    id: 'enf-sg-1',
    location: 'CTE Chin Swee Tunnel Gantry',
    detail: 'Automated 80 KM/H Digital Speed Camera + ERP 2.0',
    status: 'Active',
    coordinates: [1.2870, 103.8420],
    type: 'camera'
  },
  {
    id: 'enf-sg-2',
    location: 'Thomson Flyover Turnout',
    detail: 'Traffic Police Mobile Laser clocked 12m ago',
    status: 'Scout Confirmed',
    coordinates: [1.3320, 103.8480],
    type: 'radar'
  }
];

export const FLEET_SCOUTS: ScoutVehicle[] = [
  {
    id: 'scout-882',
    callsign: 'ComfortDelGro-882',
    driverName: 'Tan Wei Ming',
    vehicleType: 'Hyundai Ioniq 5 (LTA Mesh Node)',
    lat: 1.3420,
    lng: 103.8580,
    speedMph: 24, // in km/h 38
    status: 'verifying',
    pingsPerSec: 14.2,
    lastReport: 'CTE Braddell congestion verify'
  },
  {
    id: 'scout-412',
    callsign: 'Grab-Fleet-412',
    driverName: 'Muhammad Farhan',
    vehicleType: 'Toyota Prius Hybrid (LiDAR Array)',
    lat: 1.3960,
    lng: 103.8180,
    speedMph: 60,
    status: 'patrolling',
    pingsPerSec: 16.5,
    lastReport: 'Upper Thomson TP speed check'
  },
  {
    id: 'scout-309',
    callsign: 'LTA-EMAS-309',
    driverName: 'Suresh Kumar',
    vehicleType: 'Isuzu Heavy Recovery Truck',
    lat: 1.3410,
    lng: 103.7760,
    speedMph: 45,
    status: 'patrolling',
    pingsPerSec: 12.1,
    lastReport: 'PIE Anak Bukit debris clearance'
  },
  {
    id: 'scout-114',
    callsign: 'Strides-EV-114',
    driverName: 'Grace Lim',
    vehicleType: 'BYD e6 (Connected Scout)',
    lat: 1.2800,
    lng: 103.8540,
    speedMph: 50,
    status: 'idle',
    pingsPerSec: 9.8,
    lastReport: 'Marina Boulevard peak flow'
  }
];
