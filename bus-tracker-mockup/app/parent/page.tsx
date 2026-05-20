"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bus,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import {
  CHILDREN,
  getBus,
  getChild,
  getRoute,
  getSchool,
} from "@/lib/mockData";
import {
  etaToStop,
  formatEta,
  positionOnRoute,
  progressForBus,
} from "@/lib/simulation";
import { useTick } from "@/lib/useTick";

const ParentMap = dynamic(() => import("@/components/ParentMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-ink-300">
      Loading map…
    </div>
  ),
});

export default function ParentPage() {
  const tick = useTick(1000);
  const [childId, setChildId] = useState<string>(CHILDREN[0].id);

  const view = useMemo(() => {
    const child = getChild(childId)!;
    const bus = getBus(child.busId)!;
    const route = getRoute(bus.routeId)!;
    const school = getSchool(child.schoolId)!;
    const progress = progressForBus(bus, route, tick);
    const pos = positionOnRoute(route, progress);
    const stopIndex = route.stops.findIndex((s) => s.id === child.stopId);
    const eta = etaToStop(route, progress, stopIndex);
    return { child, bus, route, school, pos, stopIndex, eta, progress };
  }, [childId, tick]);

  const { child, bus, route, school, pos, stopIndex, eta, progress } = view;
  const stopPassed = pos.completedStops > stopIndex;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="bg-white/80 backdrop-blur border-b border-ink-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-navy-700 text-white flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 -ml-0.5 group-hover:-translate-x-0.5 transition" />
          </div>
          <span className="font-bold text-navy-700">BusTrack</span>
          <span className="text-ink-300 text-sm">/ Parent</span>
        </Link>

        <div className="relative">
          <label className="text-[11px] uppercase tracking-wide text-ink-400 mr-2">
            Tracking
          </label>
          <div className="inline-flex items-center gap-1 bg-ink-50 border border-ink-100 rounded-full pl-3 pr-1 py-1">
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-navy-700 pr-6 focus:outline-none appearance-none"
            >
              {CHILDREN.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-ink-400 -ml-5 pointer-events-none" />
          </div>
        </div>
      </nav>

      <div className="flex-1 grid lg:grid-cols-[420px_1fr]">
        {/* Sidebar */}
        <aside className="overflow-y-auto bg-transparent p-5 space-y-4">
          {/* Hero ETA card */}
          <div className="rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 p-6 text-white shadow-lift relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="flex items-center gap-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Bus className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/60">
                  {child.name.split(" ")[0]}&apos;s bus
                </p>
                <p className="font-bold text-lg">{bus.plate}</p>
              </div>
              <span className="ml-auto">
                <StatusBadge status={bus.status} dark />
              </span>
            </div>

            <div className="mt-6 relative">
              <p className="text-[11px] uppercase tracking-widest text-white/60">
                {stopPassed ? "Picked up at" : "Arriving at"} {route.stops[stopIndex].name}
              </p>
              {stopPassed ? (
                <div className="mt-1 flex items-baseline gap-2">
                  <CheckCircle2 className="w-7 h-7 text-amber-300" />
                  <span className="text-3xl font-extrabold">On the bus</span>
                </div>
              ) : (
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-6xl font-extrabold tracking-tight">
                    {formatEta(eta).replace(" min", "")}
                  </span>
                  <span className="text-xl text-white/70 font-semibold">
                    {eta > 60 ? "min" : "sec"}
                  </span>
                </div>
              )}
              <p className="text-xs text-white/60 mt-2">
                Scheduled {route.stops[stopIndex].scheduledTime}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-5 relative">
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] uppercase tracking-wide text-white/50">
                <span>Started</span>
                <span>{Math.round(progress * 100)}%</span>
                <span>School</span>
              </div>
            </div>
          </div>

          {/* Driver card */}
          <div className="rounded-2xl bg-white p-4 shadow-card border border-ink-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
              {bus.driver.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wide text-ink-400">Driver</p>
              <p className="font-semibold text-navy-700">{bus.driver}</p>
            </div>
            <a
              href={`tel:${bus.driverPhone}`}
              className="w-10 h-10 rounded-full bg-navy-700 text-white flex items-center justify-center hover:bg-navy-600 transition shadow-card"
              aria-label="Call driver"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Trust strip */}
          <div className="rounded-2xl bg-white p-4 shadow-card border border-ink-100 grid grid-cols-2 gap-3">
            <TrustChip icon={<ShieldCheck className="w-4 h-4" />} label="Vetted driver" />
            <TrustChip icon={<MapPin className="w-4 h-4" />} label="Live GPS · 1s" />
          </div>

          {/* Route */}
          <div className="rounded-2xl bg-white p-5 shadow-card border border-ink-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-navy-700">{route.name}</p>
              <span className="text-[10px] uppercase tracking-wider text-ink-400">
                {pos.completedStops}/{route.stops.length} done
              </span>
            </div>
            <ol className="relative space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-ink-100">
              {route.stops.map((s, idx) => {
                const done = idx < pos.completedStops;
                const next = idx === pos.completedStops;
                const isYours = s.id === child.stopId;
                return (
                  <li key={s.id} className="flex items-start gap-3 relative">
                    <div className="relative z-10 mt-0.5">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-navy-700 bg-white rounded-full" />
                      ) : isYours ? (
                        <div className="w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                      ) : (
                        <Circle
                          className={`w-4 h-4 ${
                            next ? "text-navy-700" : "text-ink-300"
                          } bg-white rounded-full`}
                        />
                      )}
                    </div>
                    <div className="flex-1 flex items-baseline justify-between gap-3">
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            done
                              ? "text-ink-300 line-through"
                              : isYours
                              ? "text-amber-700"
                              : next
                              ? "text-navy-700"
                              : "text-ink-500"
                          }`}
                        >
                          {s.name}
                        </p>
                        {isYours && !done && (
                          <p className="text-[10px] uppercase tracking-wide text-amber-600 font-semibold">
                            Your stop
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-ink-400 font-medium">
                        {s.scheduledTime}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {bus.status === "delayed" && (
            <div className="rounded-2xl bg-danger-100 border border-danger-500/20 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-danger-500">Traffic delay</p>
                <p className="text-ink-500 text-xs mt-0.5">
                  We&apos;ll keep you posted as the bus catches up.
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* Map */}
        <div className="relative p-5 pl-0">
          <div className="relative rounded-3xl overflow-hidden shadow-lift border border-ink-100 h-full">
            <ParentMap
              bus={bus}
              route={route}
              school={school}
              busPos={pos}
              highlightStopId={child.stopId}
            />
            <div className="map-vignette" />

            {/* Floating glass overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-[500]">
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 pointer-events-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-xs font-semibold text-navy-700">LIVE</span>
                <span className="text-xs text-ink-400">updated just now</span>
              </div>

              <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 pointer-events-auto">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-navy-700">
                  {stopPassed ? "On board" : formatEta(eta)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TrustChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-500">
      <span className="w-7 h-7 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

function StatusBadge({ status, dark }: { status: string; dark?: boolean }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    on_route: {
      bg: dark ? "bg-success-500/20" : "bg-success-100",
      fg: dark ? "text-success-100" : "text-success-500",
      label: "On route",
    },
    delayed: {
      bg: dark ? "bg-danger-500/25" : "bg-danger-100",
      fg: dark ? "text-danger-100" : "text-danger-500",
      label: "Delayed",
    },
    idle: {
      bg: dark ? "bg-white/15" : "bg-ink-50",
      fg: dark ? "text-white/70" : "text-ink-400",
      label: "Idle",
    },
    arrived: {
      bg: dark ? "bg-success-500/20" : "bg-success-100",
      fg: dark ? "text-success-100" : "text-success-500",
      label: "Arrived",
    },
  };
  const s = map[status] ?? map.idle;
  return (
    <span
      className={`inline-flex items-center gap-1 ${s.bg} ${s.fg} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
