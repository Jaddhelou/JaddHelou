"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BUSES,
  SCHOOLS,
  getRoute,
} from "@/lib/mockData";
import { positionOnRoute, progressForBus } from "@/lib/simulation";
import { useTick } from "@/lib/useTick";

const DashboardMap = dynamic(() => import("@/components/DashboardMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-slate-400">
      Loading map…
    </div>
  ),
});

export default function DashboardPage() {
  const tick = useTick(1000);
  const [selectedBusId, setSelectedBusId] = useState<string | undefined>();

  const school = SCHOOLS[0];

  const fleet = useMemo(() => {
    return BUSES.map((bus) => {
      const route = getRoute(bus.routeId)!;
      const progress = progressForBus(bus, route, tick);
      const position = positionOnRoute(route, progress);
      return { bus, route, position };
    });
  }, [tick]);

  const stats = useMemo(() => {
    const total = fleet.length;
    const onRoute = fleet.filter((f) => f.bus.status === "on_route").length;
    const delayed = fleet.filter((f) => f.bus.status === "delayed").length;
    const idle = fleet.filter((f) => f.bus.status === "idle").length;
    const onboard = fleet.reduce((s, f) => s + f.bus.onboard, 0);
    const capacity = fleet.reduce((s, f) => s + f.bus.capacity, 0);
    return { total, onRoute, delayed, idle, onboard, capacity };
  }, [fleet]);

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-900 font-semibold">
          <span>🚌</span>
          <span>BusTrack</span>
          <span className="text-slate-400 font-normal text-sm ml-2">
            / {school.name} — Operations
          </span>
        </Link>
        <div className="text-xs text-slate-500">Live</div>
      </nav>

      <section className="bg-white border-b border-slate-200 px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Buses" value={stats.total.toString()} accent="brand" />
        <Stat label="On route" value={stats.onRoute.toString()} accent="blue" />
        <Stat label="Delayed" value={stats.delayed.toString()} accent="red" />
        <Stat label="Idle" value={stats.idle.toString()} accent="slate" />
        <Stat
          label="Riders onboard"
          value={`${stats.onboard} / ${stats.capacity}`}
          accent="green"
        />
      </section>

      <div className="flex-1 grid md:grid-cols-[1fr_360px]">
        <div className="relative">
          <DashboardMap
            fleet={fleet}
            school={school}
            selectedBusId={selectedBusId}
            onSelect={setSelectedBusId}
          />
        </div>

        <aside className="bg-white border-l border-slate-200 overflow-y-auto">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Active fleet</h2>
            <p className="text-xs text-slate-500">
              Click a bus to highlight it on the map
            </p>
          </div>
          <ul>
            {fleet.map((f) => {
              const selected = f.bus.id === selectedBusId;
              return (
                <li
                  key={f.bus.id}
                  onClick={() => setSelectedBusId(f.bus.id)}
                  className={`px-5 py-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
                    selected ? "bg-brand-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {f.bus.plate}
                      </p>
                      <p className="text-xs text-slate-500">{f.route.name}</p>
                    </div>
                    <StatusPill status={f.bus.status} />
                  </div>
                  <div className="mt-2 grid grid-cols-3 text-xs gap-2">
                    <div>
                      <p className="text-slate-400">Driver</p>
                      <p className="text-slate-700 truncate">{f.bus.driver}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Onboard</p>
                      <p className="text-slate-700">
                        {f.bus.onboard}/{f.bus.capacity}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Progress</p>
                      <p className="text-slate-700">
                        {Math.round(f.position.progress * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(f.position.progress * 100)}%`,
                        background: f.route.color,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "brand" | "blue" | "red" | "slate" | "green";
}) {
  const colors: Record<typeof accent, string> = {
    brand: "text-brand-700",
    blue: "text-blue-600",
    red: "text-red-600",
    slate: "text-slate-500",
    green: "text-green-600",
  };
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${colors[accent]}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    on_route: "bg-blue-100 text-blue-700",
    delayed: "bg-red-100 text-red-700",
    idle: "bg-slate-100 text-slate-600",
    arrived: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
        map[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
