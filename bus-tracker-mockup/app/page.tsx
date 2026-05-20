import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🚌</span>
            <h1 className="text-3xl font-bold text-brand-900">BusTrack</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Live bus tracking for schools and the families they serve. Parents
            see exactly where their child&apos;s bus is. Operators see the whole
            fleet at a glance.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/parent"
            className="group block rounded-2xl bg-white p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-brand-500 transition"
          >
            <div className="text-3xl mb-3">👨‍👩‍👧</div>
            <h2 className="text-xl font-semibold mb-2 text-slate-900">
              Parent view
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              Track your child&apos;s bus in real time. See the next stop, the
              ETA at pickup, and where the bus is right now along the route.
            </p>
            <span className="text-brand-600 font-medium text-sm group-hover:underline">
              Open parent app →
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="group block rounded-2xl bg-white p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-brand-500 transition"
          >
            <div className="text-3xl mb-3">🏫</div>
            <h2 className="text-xl font-semibold mb-2 text-slate-900">
              Entity dashboard
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              Schools and transport operators see every bus on one map, with
              status, capacity, driver, and route at a glance.
            </p>
            <span className="text-brand-600 font-medium text-sm group-hover:underline">
              Open dashboard →
            </span>
          </Link>
        </div>

        <footer className="mt-16 text-xs text-slate-500">
          Mockup with simulated live data. Map tiles by OpenStreetMap.
        </footer>
      </div>
    </main>
  );
}
