import { Skeleton } from '@/components/ui/skeleton';

function VirtualizedTableSkeleton() {
  return (
    <div className="m-2.5 flex h-full max-w-full flex-col">
      <div className="mb-2.5 flex max-w-full flex-wrap gap-2">
        <Skeleton className="h-10 w-[18.75rem]" />
        <Skeleton className="h-10 w-[18.75rem]" />
      </div>
      <Skeleton className="h-[25rem] w-full" />
    </div>
  );
}

export { VirtualizedTableSkeleton };
