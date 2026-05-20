"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bus,
  Users,
  AlertTriangle,
  PauseCircle,
  CircleDot,
  ArrowLeft,
  Search,
  ChevronRight,
  Phone,
  TrendingUp,
} from "lucide-react";
import { BUSES, SCHOOLS, getRoute } from "@/lib/mockData";
import { positionOnRoute, progressForBus } from "@/lib/simulation";
import { useTick } from "@/lib/useTick";

const DashboardMap = dynamic(() => import("@/components/DashboardMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-ink-300">
      Loading map…
    </div>
  ),
});

export default function DashboardPage() {
  const tick = useTick(1000);
  const [selectedBusId, setSelectedBusId] = useState<string | undefined>();
  const [filter, setFilter] = useState("");
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
    return {
      total: fleet.length,
      onRoute: fleet.filter((f) => f.bus.status === "on_route").length,
      delayed: fleet.filter((f) => f.bus.status === "delayed").length,
      idle: fleet.filter((f) => f.bus.status === "idle").length,
      onboard: fleet.reduce((s, f) => s + f.bus.onboard, 0),
      capacity: fleet.reduce((s, f) => s + f.bus.capacity, 0),
    };
  }, [fleet]);

  const filtered = fleet.filter(
    (f) =>
      !filter ||
      f.bus.plate.toLowerCase().includes(filter.toLowerCase()) ||
      f.bus.driver.toLowerCase().includes(filter.toLowerCase()) ||
      f.route.name.toLowerCase().includes(filter.toLowerCase())
  );

  const selected = fleet.find((f) => f.bus.id === selectedBusId);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="bg-white/80 backdrop-blur border-b border-ink-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-navy-700 text-white flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 -ml-0.5 group-hover:-translate-x-0.5 transition" />
          </div>
          <span className="font-bold text-navy-700">BusTrack</span>
          <span className="text-ink-300 text-sm">/ {school.name} · Operations</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-success-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
            </span>
            Live
          </span>
          <span className="text-ink-300 text-sm">{new Date().toLocaleTimeString()}</span>
        </div>
      </nav>

      {/* KPI bento */}
      <section className="px-6 pt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <KpiTile
          icon={<Bus className="w-5 h-5" />}
          label="Active fleet"
          value={`${stats.total}`}
          accent="navy"
        />
        <KpiTile
          icon={<CircleDot className="w-5 h-5" />}
          label="On route"
          value={`${stats.onRoute}`}
          accent="success"
          trend="+1 since 06:00"
        />
        <KpiTile
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Delayed"
          value={`${stats.delayed}`}
          accent="danger"
        />
        <KpiTile
          icon={<PauseCircle className="w-5 h-5" />}
          label="Idle"
          value={`${stats.idle}`}
          accent="muted"
        />
        <KpiTile
          icon={<Users className="w-5 h-5" />}
          label="Riders onboard"
          value={`${stats.onboard}`}
          sub={`of ${stats.capacity} seats`}
          accent="amber"
          trend={`${Math.round((stats.onboard / stats.capacity) * 100)}% load`}
        />
      </section>

      {/* Map + sidebar */}
      <div className="flex-1 grid lg:grid-cols-[1fr_400px] gap-3 p-5 pt-3 overflow-hidden">
        <div className="relative rounded-3xl overflow-hidden shadow-lift border border-ink-100 min-h-[520px]">
          <DashboardMap
            fleet={fleet}
            school={school}
            selectedBusId={selectedBusId}
            onSelect={setSelectedBusId}
          />
          <div className="map-vignette" />

          {/* Floating selected-bus glass card */}
          {selected && (
            <div className="absolute bottom-4 left-4 right-4 max-w-md glass rounded-2xl p-4 flex items-center gap-4 z-[500]">
              <div className="w-12 h-12 rounded-2xl bg-navy-700 text-white flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-navy-700">{selected.bus.plate}</p>
                  <StatusPill status={selected.bus.status} />
                </div>
                <p className="text-xs text-ink-400">
                  {selected.route.name} · {selected.bus.driver}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-ink-400">
                  Progress
                </p>
                <p className="font-bold text-navy-700">
                  {Math.round(selected.position.progress * 100)}%
                </p>
              </div>
              <a
                href={`tel:${selected.bus.driverPhone}`}
                className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition"
                aria-label="Call driver"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4 glass rounded-2xl px-4 py-3 text-[11px] space-y-1.5 z-[500]">
            <p className="font-semibold text-navy-700 uppercase tracking-wider text-[10px] mb-1">
              Legend
            </p>
            <Legend color="#0B2545" label="On route" />
            <Legend color="#EF4444" label="Delayed" />
            <Legend color="#9CA7B8" label="Idle" />
          </div>
        </div>

        {/* Fleet sidebar */}
        <aside className="bg-white rounded-3xl border border-ink-100 shadow-card flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-navy-700">Active fleet</h2>
              <span className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                {filtered.length} of {fleet.length}
              </span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink-300" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search plate, driver, route"
                className="w-full pl-9 pr-3 py-2 bg-ink-50 rounded-xl text-sm placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-navy-700/15 border border-transparent focus:border-navy-700/30"
              />
            </div>
          </div>

          <ul className="overflow-y-auto flex-1">
            {filtered.map((f) => {
              const isSelected = f.bus.id === selectedBusId;
              return (
                <li
                  key={f.bus.id}
                  onClick={() => setSelectedBusId(f.bus.id)}
                  className={`px-5 py-4 border-b border-ink-100/70 cursor-pointer transition relative ${
                    isSelected ? "bg-amber-50/50" : "hover:bg-ink-50/60"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-amber-500" />
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: f.route.color,
                        boxShadow: `0 6px 14px -4px ${f.route.color}77`,
                      }}
                    >
                      <Bus className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-navy-700 truncate">
                          {f.bus.plate}
                        </p>
                        <StatusPill status={f.bus.status} />
                      </div>
                      <p className="text-xs text-ink-400 truncate">
                        {f.route.name}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-300" />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-300">
                        Driver
                      </p>
                      <p className="text-ink-500 truncate font-medium">
                        {f.bus.driver}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-300">
                        Onboard
                      </p>
                      <p className="text-ink-500 font-medium">
                        {f.bus.onboard}
                        <span className="text-ink-300">/{f.bus.capacity}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-ink-300">
                        Progress
                      </p>
                      <p className="text-ink-500 font-medium">
                        {Math.round(f.position.progress * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
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

function KpiTile({
  icon,
  label,
  value,
  sub,
  trend,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  accent: "navy" | "amber" | "success" | "danger" | "muted";
}) {
  const accents: Record<typeof accent, string> = {
    navy: "bg-navy-700 text-white",
    amber: "bg-amber-100 text-amber-600",
    success: "bg-success-100 text-success-500",
    danger: "bg-danger-100 text-danger-500",
    muted: "bg-ink-100 text-ink-500",
  };
  return (
    <div className="kpi-tile flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${accents[accent]}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-ink-400 font-semibold">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-extrabold text-navy-700 leading-tight">
            {value}
          </p>
          {sub && <span className="text-xs text-ink-400">{sub}</span>}
        </div>
        {trend && (
          <p className="text-[10px] text-success-500 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    on_route: { cls: "bg-success-100 text-success-500", label: "On route" },
    delayed: { cls: "bg-danger-100 text-danger-500", label: "Delayed" },
    idle: { cls: "bg-ink-100 text-ink-500", label: "Idle" },
    arrived: { cls: "bg-success-100 text-success-500", label: "Arrived" },
  };
  const s = map[status] ?? map.idle;
  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${s.cls}`}
    >
      <span className="w-1 h-1 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-500">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 0 3px ${color}22` }}
      />
      <span>{label}</span>
    </div>
  );
}
