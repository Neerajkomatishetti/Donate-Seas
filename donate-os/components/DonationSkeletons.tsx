import { Skeleton } from "./ui/skeleton";

const DonationCardSkeleton = () => (
    <div className="flex flex-col px-4 py-2 w-full md:w-[40%] border my-3 rounded-lg bg-secondary">
      <div className="card flex justify-center max-h-[30vh] overflow-clip">
        <Skeleton className="h-[30vh] bg-gray-500 w-full animate-pulse" />
      </div>
      <div className="flex px-4 py-2 justify-between w-full">
        <div>
          <Skeleton className="h-4 bg-gray-500 w-20 mb-2 animate-pulse" />
          <Skeleton className="h-4 bg-gray-500 w-24 animate-pulse" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-4 w-24 bg-gray-500 mb-2 animate-pulse" />
          <Skeleton className="h-3 w-28 bg-gray-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
  
 export const DonationSkeleton = () => (
    <>
      <DonationCardSkeleton />
      <DonationCardSkeleton />
      <DonationCardSkeleton />
    </>
  );

