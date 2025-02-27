import { Skeleton } from '@/components/ui/skeleton';

function TableNamesComboboxSkeleton() {
  return (
    <>
      <div className="space-y-1">
        <Skeleton className="h-8 max-w-[8.75rem]" />
        <Skeleton className="h-6 max-w-[21.188rem]" />
      </div>
      <div className="flex flex-col space-y-2.5">
        <Skeleton className="h-6 max-w-[5.625rem]" />
        <Skeleton className="h-10 max-w-full" />
      </div>
    </>
  );
}

export { TableNamesComboboxSkeleton };
