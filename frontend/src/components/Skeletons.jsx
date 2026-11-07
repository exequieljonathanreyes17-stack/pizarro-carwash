export function SkeletonServicios({ cantidad = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div
          key={i}
          className="glass-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-carbon-900/40 animate-pulse"
        >
          <div className="h-52 w-full bg-carbon-800/60" />
          <div className="flex flex-1 flex-col p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded-md bg-carbon-800" />
              <div className="h-4 w-1/3 rounded-md bg-carbon-800/60" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-full rounded bg-carbon-800/40" />
              <div className="h-3.5 w-5/6 rounded bg-carbon-800/40" />
              <div className="h-3.5 w-2/3 rounded bg-carbon-800/40" />
            </div>
            <div className="border-t border-carbon-800/80 pt-4 space-y-3">
              <div className="h-6 w-28 rounded bg-electric-500/20" />
              <div className="h-10 w-full rounded-md bg-carbon-800/70" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonProductos({ cantidad = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div
          key={i}
          className="glass-card flex flex-col overflow-hidden rounded-xl border border-white/5 bg-carbon-900/40 animate-pulse"
        >
          <div className="h-40 w-full bg-carbon-800/60" />
          <div className="flex flex-1 flex-col p-4 space-y-3">
            <div className="h-4 w-16 rounded-full bg-carbon-800/80" />
            <div className="h-5 w-3/4 rounded bg-carbon-800" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-full rounded bg-carbon-800/40" />
              <div className="h-3 w-4/5 rounded bg-carbon-800/40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonResultados({ cantidad = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div
          key={i}
          className="glass-card overflow-hidden rounded-xl border border-white/5 bg-carbon-900/40 animate-pulse text-left"
        >
          <div className="grid grid-cols-2">
            <div className="h-40 w-full bg-carbon-800/60 border-r border-carbon-800/40" />
            <div className="h-40 w-full bg-carbon-800/50" />
          </div>
          <div className="p-4 space-y-2">
            <div className="h-5 w-2/3 rounded bg-carbon-800" />
            <div className="h-3.5 w-4/5 rounded bg-carbon-800/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
