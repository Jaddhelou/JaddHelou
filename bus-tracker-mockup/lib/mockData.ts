export type LatLng = [number, number];

export interface Stop {
  id: string;
  name: string;
  position: LatLng;
  scheduledTime: string;
  students: string[];
}

export interface Route {
  id: string;
  name: string;
  color: string;
  schoolId: string;
  stops: Stop[];
  totalDurationSec: number;
}

export type BusStatus = "on_route" | "idle" | "arrived" | "delayed";

export interface Bus {
  id: string;
  plate: string;
  driver: string;
  driverPhone: string;
  routeId: string;
  capacity: number;
  onboard: number;
  status: BusStatus;
  startedAtSec: number;
}

export interface School {
  id: string;
  name: string;
  position: LatLng;
}

export interface Child {
  id: string;
  name: string;
  grade: string;
  stopId: string;
  busId: string;
  schoolId: string;
  parentName: string;
}

export const SCHOOLS: School[] = [
  {
    id: "sch-1",
    name: "Cedar Heights Academy",
    position: [33.8938, 35.5018],
  },
];

export const ROUTES: Route[] = [
  {
    id: "route-a",
    name: "Route A — Hamra Loop",
    color: "#2563eb",
    schoolId: "sch-1",
    totalDurationSec: 1500,
    stops: [
      { id: "s-a1", name: "Hamra & Bliss", position: [33.8975, 35.4801], scheduledTime: "07:05", students: ["Layla A."] },
      { id: "s-a2", name: "Sadat St.", position: [33.8960, 35.4836], scheduledTime: "07:10", students: ["Omar K.", "Rana K."] },
      { id: "s-a3", name: "Jeanne d'Arc", position: [33.8985, 35.4870], scheduledTime: "07:15", students: ["Nadim S."] },
      { id: "s-a4", name: "Sodeco Sq.", position: [33.8908, 35.5005], scheduledTime: "07:25", students: ["Yara H."] },
      { id: "s-a5", name: "Cedar Heights Academy", position: [33.8938, 35.5018], scheduledTime: "07:35", students: [] },
    ],
  },
  {
    id: "route-b",
    name: "Route B — Achrafieh Express",
    color: "#16a34a",
    schoolId: "sch-1",
    totalDurationSec: 1380,
    stops: [
      { id: "s-b1", name: "Mar Mikhael", position: [33.8987, 35.5168], scheduledTime: "07:00", students: ["Karim D."] },
      { id: "s-b2", name: "Gemmayze", position: [33.8966, 35.5142], scheduledTime: "07:08", students: ["Tala R."] },
      { id: "s-b3", name: "ABC Achrafieh", position: [33.8869, 35.5172], scheduledTime: "07:15", students: ["Jad M.", "Lana M."] },
      { id: "s-b4", name: "Hotel Dieu", position: [33.8855, 35.5121], scheduledTime: "07:22", students: ["Sami T."] },
      { id: "s-b5", name: "Cedar Heights Academy", position: [33.8938, 35.5018], scheduledTime: "07:35", students: [] },
    ],
  },
  {
    id: "route-c",
    name: "Route C — Verdun Line",
    color: "#f59e0b",
    schoolId: "sch-1",
    totalDurationSec: 1620,
    stops: [
      { id: "s-c1", name: "Verdun 730", position: [33.8825, 35.4844], scheduledTime: "06:55", students: ["Maya F."] },
      { id: "s-c2", name: "Mazraa", position: [33.8755, 35.4929], scheduledTime: "07:05", students: ["Hadi Z."] },
      { id: "s-c3", name: "Cola", position: [33.8702, 35.5012], scheduledTime: "07:15", students: ["Reem N.", "Ali N."] },
      { id: "s-c4", name: "Bechara El Khoury", position: [33.8851, 35.5028], scheduledTime: "07:25", students: ["Joud B."] },
      { id: "s-c5", name: "Cedar Heights Academy", position: [33.8938, 35.5018], scheduledTime: "07:35", students: [] },
    ],
  },
  {
    id: "route-d",
    name: "Route D — Furn El Chebbak",
    color: "#a855f7",
    schoolId: "sch-1",
    totalDurationSec: 1500,
    stops: [
      { id: "s-d1", name: "Furn El Chebbak", position: [33.8680, 35.5277], scheduledTime: "07:02", students: ["Elie G."] },
      { id: "s-d2", name: "Sin El Fil", position: [33.8757, 35.5396], scheduledTime: "07:10", students: ["Lea P."] },
      { id: "s-d3", name: "Badaro", position: [33.8744, 35.5151], scheduledTime: "07:20", students: ["Tarek W.", "Nour W."] },
      { id: "s-d4", name: "National Museum", position: [33.8830, 35.5152], scheduledTime: "07:28", students: ["Riad C."] },
      { id: "s-d5", name: "Cedar Heights Academy", position: [33.8938, 35.5018], scheduledTime: "07:35", students: [] },
    ],
  },
  {
    id: "route-e",
    name: "Route E — Jounieh Coast",
    color: "#ec4899",
    schoolId: "sch-1",
    totalDurationSec: 1800,
    stops: [
      { id: "s-e1", name: "Jounieh Old Souk", position: [33.9805, 35.6178], scheduledTime: "06:40", students: ["Cynthia A."] },
      { id: "s-e2", name: "Zouk Mikael", position: [33.9676, 35.6080], scheduledTime: "06:50", students: ["Marc V."] },
      { id: "s-e3", name: "Antelias", position: [33.9145, 35.5867], scheduledTime: "07:10", students: ["Patrick Y."] },
      { id: "s-e4", name: "Dora", position: [33.8970, 35.5572], scheduledTime: "07:22", students: ["Rita E.", "George E."] },
      { id: "s-e5", name: "Cedar Heights Academy", position: [33.8938, 35.5018], scheduledTime: "07:38", students: [] },
    ],
  },
  {
    id: "route-f",
    name: "Route F — Baabda Hills",
    color: "#14b8a6",
    schoolId: "sch-1",
    totalDurationSec: 1680,
    stops: [
      { id: "s-f1", name: "Baabda", position: [33.8344, 35.5414], scheduledTime: "06:55", students: ["Ziad H."] },
      { id: "s-f2", name: "Hazmieh", position: [33.8504, 35.5378], scheduledTime: "07:05", students: ["Carla J."] },
      { id: "s-f3", name: "Mansourieh", position: [33.8651, 35.5663], scheduledTime: "07:18", students: ["Anthony L."] },
      { id: "s-f4", name: "Mkalles", position: [33.8682, 35.5494], scheduledTime: "07:25", students: ["Nayla O."] },
      { id: "s-f5", name: "Cedar Heights Academy", position: [33.8938, 35.5018], scheduledTime: "07:38", students: [] },
    ],
  },
];

export const BUSES: Bus[] = [
  { id: "bus-101", plate: "B 101 234", driver: "Hassan Khoury", driverPhone: "+961 70 111 222", routeId: "route-a", capacity: 24, onboard: 18, status: "on_route", startedAtSec: 380 },
  { id: "bus-102", plate: "B 102 567", driver: "Maroun Saad", driverPhone: "+961 70 333 444", routeId: "route-b", capacity: 24, onboard: 16, status: "on_route", startedAtSec: 720 },
  { id: "bus-103", plate: "B 103 890", driver: "Ahmad Ali", driverPhone: "+961 70 555 666", routeId: "route-c", capacity: 30, onboard: 22, status: "on_route", startedAtSec: 200 },
  { id: "bus-104", plate: "B 104 112", driver: "Roy Daou", driverPhone: "+961 70 777 888", routeId: "route-d", capacity: 30, onboard: 14, status: "delayed", startedAtSec: 540 },
  { id: "bus-105", plate: "B 105 334", driver: "Elias Maalouf", driverPhone: "+961 70 999 000", routeId: "route-e", capacity: 36, onboard: 28, status: "on_route", startedAtSec: 980 },
  { id: "bus-106", plate: "B 106 556", driver: "Wassim Tannous", driverPhone: "+961 70 222 333", routeId: "route-f", capacity: 30, onboard: 0, status: "idle", startedAtSec: 0 },
];

export const CHILDREN: Child[] = [
  { id: "ch-1", name: "Layla Awada", grade: "Grade 4", stopId: "s-a1", busId: "bus-101", schoolId: "sch-1", parentName: "Mr. Awada" },
  { id: "ch-2", name: "Omar Khaled", grade: "Grade 6", stopId: "s-a2", busId: "bus-101", schoolId: "sch-1", parentName: "Mrs. Khaled" },
  { id: "ch-3", name: "Yara Hadidi", grade: "Grade 2", stopId: "s-a4", busId: "bus-101", schoolId: "sch-1", parentName: "Mr. Hadidi" },
  { id: "ch-4", name: "Jad Murad", grade: "Grade 5", stopId: "s-b3", busId: "bus-102", schoolId: "sch-1", parentName: "Mrs. Murad" },
];

export function getRoute(routeId: string): Route | undefined {
  return ROUTES.find((r) => r.id === routeId);
}

export function getBus(busId: string): Bus | undefined {
  return BUSES.find((b) => b.id === busId);
}

export function getSchool(schoolId: string): School | undefined {
  return SCHOOLS.find((s) => s.id === schoolId);
}

export function getChild(childId: string): Child | undefined {
  return CHILDREN.find((c) => c.id === childId);
}
