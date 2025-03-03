import { useEffect, useRef } from 'react';
import { DeleteCheckBoxButton } from './DeleteCheckBoxButton';
import { TableNamesCombobox } from './TableNamesCombobox';
import { useTableNamesStore } from './stores/tableNamesStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useTableNames } from '@/queries/useTableNames.ts';

function DeleteTable() {
  const { setTableNames, resetTableNamesStore } = useTableNamesStore(
    (state) => state.actions
  );
  const hashRef = useRef(crypto.randomUUID());
  const { data, isFetching, isError } = useTableNames(hashRef.current);

  useEffect(() => {
    return () => {
      resetTableNamesStore();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetching || isError) return;

    setTableNames(data!.data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isFetching, isError]);

  return (
    <>
      {isFetching && (
        <div className="w-full space-y-12 rounded-md border p-5">
          <div className="space-y-1">
            <Skeleton className="h-8 max-w-[8.75rem]" />
            <Skeleton className="h-6 max-w-[21.188rem]" />
          </div>
          <div className="flex flex-col space-y-2.5">
            <Skeleton className="h-6 max-w-[5.625rem]" />
            <Skeleton className="h-10 max-w-full" />
          </div>
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 max-w-[18.75rem]" />
            <Skeleton className="h-10 max-w-full" />
          </div>
        </div>
      )}
      {!isFetching && !isError && data && (
        <div className="w-full space-y-12 rounded-md border p-5">
          <TableNamesCombobox />
          <DeleteCheckBoxButton />
        </div>
      )}
    </>
  );
}

export { DeleteTable };
