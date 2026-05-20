import type { Bus, LatLng, Route } from "./mockData";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function segmentLength(a: LatLng, b: LatLng): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export interface BusPosition {
  position: LatLng;
  bearingDeg: number;
  progress: number;
  nextStopIndex: number;
  completedStops: number;
}

export function positionOnRoute(route: Route, progress: number): BusPosition {
  const clamped = Math.max(0, Math.min(1, progress));
  const pts = route.stops.map((s) => s.position);

  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = segmentLength(pts[i], pts[i + 1]);
    lengths.push(l);
    total += l;
  }

  const target = clamped * total;
  let acc = 0;
  for (let i = 0; i < lengths.length; i++) {
    if (acc + lengths[i] >= target || i === lengths.length - 1) {
      const localT = lengths[i] === 0 ? 0 : (target - acc) / lengths[i];
      const a = pts[i];
      const b = pts[i + 1];
      const lat = lerp(a[0], b[0], localT);
      const lng = lerp(a[1], b[1], localT);
      const bearing =
        (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      const completedStops = localT > 0.95 ? i + 1 : i;
      return {
        position: [lat, lng],
        bearingDeg: bearing,
        progress: clamped,
        nextStopIndex: Math.min(i + 1, pts.length - 1),
        completedStops,
      };
    }
    acc += lengths[i];
  }

  return {
    position: pts[pts.length - 1],
    bearingDeg: 0,
    progress: 1,
    nextStopIndex: pts.length - 1,
    completedStops: pts.length - 1,
  };
}

export function progressForBus(bus: Bus, route: Route, nowSec: number): number {
  if (bus.status === "idle") return 0;
  if (bus.status === "arrived") return 1;
  const elapsed = bus.startedAtSec + nowSec * 0.5;
  return Math.min(1, elapsed / route.totalDurationSec);
}

export function etaToStop(
  route: Route,
  progress: number,
  stopIndex: number
): number {
  const pts = route.stops.map((s) => s.position);
  let total = 0;
  const lengths: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const l = segmentLength(pts[i], pts[i + 1]);
    lengths.push(l);
    total += l;
  }
  let distToStop = 0;
  for (let i = 0; i < stopIndex; i++) {
    distToStop += lengths[i] ?? 0;
  }
  const distNow = progress * total;
  const remaining = Math.max(0, distToStop - distNow);
  const fraction = total === 0 ? 0 : remaining / total;
  return Math.round(fraction * route.totalDurationSec);
}

export function formatEta(sec: number): string {
  if (sec <= 0) return "Arrived";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  return `${m} min`;
}
