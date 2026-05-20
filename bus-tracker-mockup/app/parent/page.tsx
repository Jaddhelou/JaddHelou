"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
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
    <div className="flex items-center justify-center h-full text-slate-400">
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
    return { child, bus, route, school, pos, stopIndex, eta };
  }, [childId, tick]);

  const { child, bus, route, school, pos, stopIndex, eta } = view;
  const stopPassed = pos.completedStops > stopIndex;

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-900 font-semibold">
          <span>🚌</span>
          <span>BusTrack</span>
          <span className="text-slate-400 font-normal text-sm ml-2">/ parent</span>
        </Link>
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500">Viewing as parent of</label>
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white"
          >
            {CHILDREN.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="flex-1 grid md:grid-cols-[360px_1fr]">
        <aside className="bg-white border-r border-slate-200 overflow-y-auto">
          <section className="p-5 border-b border-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-500">Your child</p>
            <h2 className="text-xl font-semibold">{child.name}</h2>
            <p className="text-sm text-slate-500">
              {child.grade} · {school.name}
            </p>
          </section>

          <section className="p-5 border-b border-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Bus status
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${
                  bus.status === "delayed"
                    ? "bg-red-600"
                    : bus.status === "arrived"
                    ? "bg-green-600"
                    : bus.status === "idle"
                    ? "bg-slate-400"
                    : "bg-brand-600"
                }`}
              >
                🚌
              </div>
              <div>
                <p className="font-semibold">{bus.plate}</p>
                <p className="text-sm text-slate-500 capitalize">
                  {bus.status.replace("_", " ")}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-brand-50 border border-brand-100 px-4 py-3">
              <p className="text-xs text-brand-700 uppercase tracking-wide">
                {stopPassed ? "Picked up" : "Arrives at your stop in"}
              </p>
              <p className="text-2xl font-bold text-brand-900">
                {stopPassed ? "✓ On bus" : formatEta(eta)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Stop: {route.stops[stopIndex].name} · scheduled{" "}
                {route.stops[stopIndex].scheduledTime}
              </p>
            </div>
          </section>

          <section className="p-5 border-b border-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">
              Route progress
            </p>
            <ol className="space-y-3">
              {route.stops.map((s, idx) => {
                const done = idx < pos.completedStops;
                const isYours = s.id === child.stopId;
                return (
                  <li key={s.id} className="flex items-start gap-3">
                    <div
                      className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                        done
                          ? "bg-brand-600"
                          : isYours
                          ? "bg-amber-500 ring-4 ring-amber-100"
                          : "bg-slate-300"
                      }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          isYours ? "font-semibold text-amber-700" : ""
                        } ${done ? "text-slate-400 line-through" : ""}`}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {s.scheduledTime}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Driver
            </p>
            <p className="font-medium">{bus.driver}</p>
            <a
              href={`tel:${bus.driverPhone}`}
              className="text-sm text-brand-600 hover:underline"
            >
              {bus.driverPhone}
            </a>
          </section>
        </aside>

        <div className="relative">
          <ParentMap
            bus={bus}
            route={route}
            school={school}
            busPos={pos}
            highlightStopId={child.stopId}
          />
        </div>
      </div>
    </main>
  );
}
