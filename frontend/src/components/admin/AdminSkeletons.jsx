// Componentes Skeleton con animación pulsante para el panel de administración
export function SkeletonServicios() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="glass-card rounded-xl p-5 border border-carbon-800/80 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-2.5 w-3/4">
              <div className="h-4 w-1/4 rounded-full bg-electric-500/20"></div>
              <div className="h-5 w-3/5 rounded bg-carbon-800"></div>
              <div className="h-3 w-1/3 rounded bg-carbon-800/60"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-4 w-4 rounded bg-carbon-800"></div>
              <div className="h-4 w-4 rounded bg-carbon-800"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-carbon-800/50"></div>
            <div className="h-3 w-4/5 rounded bg-carbon-800/50"></div>
          </div>
          <div className="mt-4 h-4 w-2/5 rounded bg-electric-500/20"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonProductos() {
  return (
    <tbody>
      {[1, 2, 3, 4, 5].map((n) => (
        <tr key={n} className="border-t border-electric-500/10 animate-pulse">
          <td className="px-4 py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-carbon-800 shrink-0"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 rounded bg-carbon-800"></div>
              <div className="h-3 w-16 rounded bg-carbon-800/60"></div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-16 rounded bg-carbon-800"></div>
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-20 rounded bg-carbon-800"></div>
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-12 rounded bg-carbon-800"></div>
          </td>
          <td className="px-4 py-4 text-right">
            <div className="inline-flex gap-3">
              <div className="h-4 w-4 rounded bg-carbon-800"></div>
              <div className="h-4 w-4 rounded bg-carbon-800"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function SkeletonStats() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="glass-card rounded-xl p-5 border border-carbon-800/80 animate-pulse">
          <div className="h-6 w-6 rounded bg-electric-500/20"></div>
          <div className="mt-3 h-8 w-16 rounded bg-carbon-800"></div>
          <div className="mt-2 h-3.5 w-24 rounded bg-carbon-800/60"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="glass-card rounded-xl p-5 border border-carbon-800/80 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded bg-carbon-800 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-carbon-800"></div>
              <div className="h-3 w-1/2 rounded bg-carbon-800/60"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonResenas() {
  return (
    <div className="mt-6 space-y-3">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="glass-card rounded-xl p-4 border border-carbon-800/80 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-28 rounded bg-electric-500/20"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 rounded bg-carbon-800"></div>
                <div className="h-3 w-16 rounded bg-carbon-800/60"></div>
              </div>
              <div className="h-3.5 w-3/4 rounded bg-carbon-800/50"></div>
            </div>
            <div className="h-4 w-4 rounded bg-carbon-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
