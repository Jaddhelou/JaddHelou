# BusTrack — Mockup

A mockup of a school-bus live-tracking platform with two surfaces:

- **Parent view** (`/parent`) — a parent picks their child and sees the bus
  position, the next stop, an ETA at pickup, and the full route progress.
- **Entity dashboard** (`/dashboard`) — a school or transport operator sees
  every active bus on one map, with status, capacity, driver, and route.

All data is mocked. Bus positions are interpolated along predefined polylines
and animated client-side so the views feel "live."

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Leaflet + react-leaflet (OpenStreetMap tiles)

## Run locally

```bash
cd bus-tracker-mockup
npm install
npm run dev
```

Open http://localhost:3000.

## What's where

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Landing page with links to the two surfaces |
| `app/parent/page.tsx` | Parent view — single child, single bus |
| `app/dashboard/page.tsx` | Entity dashboard — full fleet view |
| `components/ParentMap.tsx` | Leaflet map for one bus + its route |
| `components/DashboardMap.tsx` | Leaflet map for the whole fleet |
| `lib/mockData.ts` | Schools, routes, stops, buses, children |
| `lib/simulation.ts` | Polyline interpolation, ETA, progress |
| `lib/useTick.ts` | 1-second tick for the simulated "live" updates |

## What to extend next

- Wire to a real telemetry source (replace `useTick` + `progressForBus` with
  a websocket/SSE feed).
- Auth + roles: parent sees only their child's bus; entity admin sees all.
- Push notifications when the bus is N minutes from the stop.
- Driver-side app for boarding/check-in.
