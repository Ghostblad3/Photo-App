import { Skeleton } from '@/components/ui/skeleton';

function CardsSkeleton() {
  return (
    <>
      <div className="my-2 flex w-full items-center gap-2.5 pl-2.5">
        <Skeleton
          data-testid="header-skeleton-1"
          className="h-6 w-11 rounded-lg shadow-lg"
        />
        <Skeleton
          data-testid="header-skeleton-2"
          className="h-3.5 w-[9.25rem] shadow-lg"
        />
      </div>
      <div className="grid auto-rows-fr gap-5 p-2.5 lg:grid-cols-4">
        <Skeleton
          data-testid="card-skeleton-1"
          className="h-[6.875rem] rounded-lg shadow-lg"
        />
        <Skeleton
          data-testid="card-skeleton-2"
          className="h-[6.875rem] rounded-lg shadow-lg"
        />
        <Skeleton
          data-testid="card-skeleton-3"
          className="h-[6.875rem] rounded-lg shadow-lg"
        />
        <Skeleton
          data-testid="card-skeleton-4"
          className="h-[6.875rem] rounded-lg shadow-lg"
        />
      </div>
    </>
  );
}

export { CardsSkeleton };
