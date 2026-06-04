export function PerformanceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="col-span-12 flex justify-between items-center h-12">
        {/* Increased contrast for dark mode */}
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg w-40" />
        <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded-2xl w-64" />
      </div>

      {/* Sidebar Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:col-span-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-zinc-200 dark:bg-zinc-700 rounded-3xl"
          />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="md:col-span-9 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-700 rounded-3xl" />
          <div className="h-64 bg-zinc-200 dark:bg-zinc-700 rounded-3xl" />
        </div>
        <div className="h-80 bg-zinc-200 dark:bg-zinc-700 rounded-3xl" />
      </div>
    </div>
  );
}
