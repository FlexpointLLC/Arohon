/**
 * Shared skeletons for dashboard loading states.
 * Used by loading.tsx in each segment for instant nav + loading UI.
 */

function Pulse({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-slate-600/50 animate-pulse ${className}`} />;
}

/** Dashboard home: title, subtitle, stat cards grid, recent table section */
export function DashboardHomeSkeleton() {
  return (
    <div className="p-8">
      <Pulse className="h-8 w-48" />
      <Pulse className="mt-1 h-4 w-72" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card p-5">
            <Pulse className="mb-2 h-7 w-7" />
            <Pulse className="h-8 w-12" />
            <Pulse className="mt-2 h-4 w-24" />
          </div>
        ))}
      </div>
      <section className="mt-10">
        <Pulse className="h-6 w-32" />
        <Pulse className="mt-1 h-4 w-40" />
        <div className="card mt-4 overflow-hidden">
          <div className="flex justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
            <Pulse className="h-8 w-20" />
          </div>
          <div className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Pulse key={i} className="h-4 flex-1" />
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-700/50">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex gap-4 px-4 py-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Pulse key={j} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
        <Pulse className="mt-4 h-4 w-28" />
      </section>
    </div>
  );
}

/** Generic table page: title, subtitle, filter row, card with toolbar + table + pagination */
export function TablePageSkeleton() {
  return (
    <div className="p-8">
      <Pulse className="h-8 w-32" />
      <Pulse className="mt-1 h-4 w-80" />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Pulse className="h-9 w-40" />
        <Pulse className="h-9 w-40" />
        <Pulse className="h-4 w-6" />
        <Pulse className="h-9 w-40" />
      </div>
      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
          <Pulse className="h-8 w-24" />
        </div>
        <div className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Pulse key={i} className="h-4 flex-1 min-w-0" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-700/50">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="flex gap-2 px-4 py-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                <Pulse key={j} className="h-4 flex-1 min-w-0" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-slate-700/50 px-4 py-3">
          <Pulse className="h-4 w-36" />
          <div className="flex gap-2">
            <Pulse className="h-8 w-8" />
            <Pulse className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
