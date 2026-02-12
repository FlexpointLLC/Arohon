export function PaymentsContentSkeleton() {
  return (
    <div className="px-8 pb-8 pt-0">
      {/* Stat cards skeleton */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4">
            <div className="h-3 w-24 rounded bg-slate-600/60 animate-pulse" />
            <div className="mt-2 h-8 w-16 rounded bg-slate-500/50 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table card skeleton */}
      <div className="card mt-4 overflow-hidden">
        <div className="border-b border-slate-600/80 p-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 flex-1 rounded bg-slate-600/50 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-700/50">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex gap-4 p-4">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div
                  key={j}
                  className="h-4 flex-1 rounded bg-slate-600/40 animate-pulse"
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-slate-600/80 p-3">
          <div className="h-4 w-32 rounded bg-slate-600/40 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded bg-slate-600/40 animate-pulse" />
            <div className="h-8 w-8 rounded bg-slate-600/40 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsLoading() {
  return <PaymentsContentSkeleton />;
}
