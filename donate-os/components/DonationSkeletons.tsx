import { Skeleton } from "./ui/skeleton";

const DonationCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-3xl max-h-[300px] h-[300px] border border-black/[0.03] dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl transition-all">
    {/* Image Section Skeleton */}
    <div className="relative h-48 w-full bg-black/5 dark:bg-white/5 animate-pulse">
      {/* Floating Badge Skeleton */}
      <div className="absolute top-4 right-4 z-10">
        <Skeleton className="h-6 w-16 rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    </div>

    {/* Content Section Skeleton */}
    <div className="flex flex-col p-6 gap-5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
          <Skeleton className="h-3 w-24 rounded bg-black/5 dark:bg-white/5" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-2 w-12 rounded bg-black/5 dark:bg-white/5" />
          <Skeleton className="h-6 w-16 rounded-lg bg-black/10 dark:bg-white/10" />
        </div>
      </div>

      <div className="flex gap-2">
        <Skeleton className="flex-1 h-10 rounded-xl bg-black/10 dark:bg-white/10" />
        <Skeleton className="w-12 h-10 rounded-xl bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  </div>
);

export const DonationSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <DonationCardSkeleton key={i} />
    ))}
  </>
);
