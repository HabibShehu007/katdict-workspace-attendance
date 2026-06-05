export default function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Skeleton */}
        <div className="lg:col-span-1 h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        {/* Right Skeleton */}
        <div className="lg:col-span-2 h-80 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
      </div>
    </div>
  );
}
