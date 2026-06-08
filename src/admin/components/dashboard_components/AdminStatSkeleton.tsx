export default function AdminStatSkeleton() {
  return (
    <div className="w-full">
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            // Changed: Base is now solid white, border is clearly defined
            className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-start gap-4 animate-pulse shadow-sm"
          >
            {/* Icon Skeleton */}
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />

            <div className="space-y-3 flex-1">
              {/* Label Skeleton */}
              <div className="w-20 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
              {/* Title Skeleton */}
              <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
              {/* Desc Skeleton */}
              <div className="w-24 h-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view */}
      <div className="md:hidden w-full h-32 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl animate-pulse shadow-sm" />
    </div>
  );
}
