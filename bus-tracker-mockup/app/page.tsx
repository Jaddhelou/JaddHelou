import Link from "next/link";
import {
  Bus,
  Users,
  Building2,
  ShieldCheck,
  Radar,
  Bell,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-navy-700 text-white flex items-center justify-center shadow-card">
            <Bus className="w-5 h-5" />
          </div>
          <span className="font-bold text-navy-700 text-lg tracking-tight">BusTrack</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-500">
          <a className="hover:text-navy-700" href="#features">Features</a>
          <a className="hover:text-navy-700" href="#parents">For parents</a>
          <a className="hover:text-navy-700" href="#schools">For schools</a>
          <Link
            href="/dashboard"
            className="rounded-full bg-navy-700 text-white px-4 py-2 font-medium hover:bg-navy-600 transition"
          >
            Open dashboard
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-semibold mb-5">
              <Radar className="w-3.5 h-3.5" /> Live since the moment the doors open
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-navy-700 leading-[1.05]">
              Every bus.
              <br />
              <span className="text-amber-500">Every kid.</span>
              <br />
              On one map.
            </h1>
            <p className="mt-6 text-lg text-ink-400 max-w-xl leading-relaxed">
              BusTrack gives schools a live operations dashboard and gives
              parents the calm of knowing exactly where their child&apos;s bus is —
              from doorstep to drop-off.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/parent"
                className="inline-flex items-center gap-2 rounded-full bg-navy-700 text-white px-6 py-3 font-semibold shadow-lift hover:bg-navy-600 transition"
              >
                Parent view <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white text-navy-700 px-6 py-3 font-semibold shadow-card border border-ink-100 hover:border-navy-700 transition"
              >
                Entity dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-8 text-xs text-ink-400">
              <Trust label="Live GPS" />
              <Trust label="ETA accuracy" />
              <Trust label="Driver-vetted" />
              <Trust label="Privacy first" />
            </div>
          </div>

          {/* Hero bento */}
          <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[480px]">
            <div className="col-span-4 row-span-4 rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 p-6 text-white shadow-lift relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-500/30 blur-2xl" />
              <p className="text-xs uppercase tracking-widest text-white/60">Live fleet</p>
              <p className="text-5xl font-extrabold mt-1">6</p>
              <p className="text-sm text-white/70 mt-1">buses on the road right now</p>

              <div className="mt-6 space-y-3">
                <MiniBusRow color="#F59E0B" label="Route A" sub="Hamra Loop · 64%" />
                <MiniBusRow color="#10B981" label="Route B" sub="Achrafieh · 41%" />
                <MiniBusRow color="#EF4444" label="Route D" sub="Furn El Chebbak · delayed" delayed />
              </div>
            </div>

            <div className="col-span-2 row-span-3 rounded-3xl bg-white p-5 shadow-card border border-ink-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <p className="font-semibold text-navy-700">5-min alerts</p>
              <p className="text-xs text-ink-400 mt-1 leading-relaxed">
                Push notification when the bus is 5 minutes from your stop.
              </p>
            </div>

            <div className="col-span-2 row-span-3 rounded-3xl bg-amber-500 p-5 text-white shadow-card">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="font-semibold">SafeBoard</p>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Boarding logs per child, per stop, with driver confirmation.
              </p>
            </div>

            <div className="col-span-4 row-span-2 rounded-3xl bg-white p-5 shadow-card border border-ink-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-700">Next stop · Hamra & Bliss</p>
                <p className="text-xs text-ink-400 mt-0.5">Arrives in 2 min · scheduled 07:05</p>
              </div>
              <div className="text-3xl font-extrabold text-amber-500">2&apos;</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/parent"
            className="group rounded-3xl bg-white p-8 shadow-card border border-ink-100 hover:shadow-lift hover:border-amber-500/40 transition"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-ink-300 font-semibold">
                For parents
              </span>
            </div>
            <h3 className="text-2xl font-bold text-navy-700 mt-6">Parent app</h3>
            <p className="text-sm text-ink-400 mt-2 leading-relaxed">
              Open the app, see the bus. ETA at your stop, route progress, driver contact,
              and pickup confirmation — all live.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-amber-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Open parent view <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="group rounded-3xl bg-navy-700 p-8 text-white shadow-lift hover:shadow-glass transition relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="flex items-start justify-between relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                For schools & operators
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-6 relative">Operations dashboard</h3>
            <p className="text-sm text-white/70 mt-2 leading-relaxed relative">
              Every bus on one map. Live status, capacity, driver, route progress, and
              delays — at a glance.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-amber-300 font-semibold text-sm group-hover:gap-3 transition-all relative">
              Open dashboard <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-ink-300">
        Mockup with simulated live data · Map tiles by OpenStreetMap
      </footer>
    </main>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {label}
    </span>
  );
}

function MiniBusRow({
  color,
  label,
  sub,
  delayed,
}: {
  color: string;
  label: string;
  sub: string;
  delayed?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 0 4px ${color}33` }}
      />
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-white/60">{sub}</p>
      </div>
      {delayed && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger-500/20 text-danger-100 font-semibold uppercase">
          Delayed
        </span>
      )}
    </div>
  );
}
