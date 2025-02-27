import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DeleteCheckBoxButton } from './DeleteCheckBoxButton';
import { TableNamesCombobox } from './TableNamesCombobox';
import { useTableNamesStore } from './stores/tableNamesStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useOperationStore } from '@/global-stores/operationStore';
import { delay } from '@/utils/delay';

function DeleteTable() {
  const { setTableNames, resetTableNamesStore } = useTableNamesStore(
    (state) => state.actions
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const hash = useRef('');
  const [fetchStatus, setFetchStatus] = useState<'pending' | 'success'>(
    'pending'
  );

  useEffect(() => {
    return () => {
      resetTableNamesStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isFetching, isError, isSuccess, data } = useQuery({
    queryKey: ['tableNames-delete'],
    queryFn: async () => {
      hash.current = crypto.randomUUID();
      setFetchStatus('pending');

      addOperation(
        hash.current,
        'pending',
        'fetch',
        'Fetching table names',
        false
      );

      const startTime = Date.now();

      const response = await fetch('http://localhost:3000/table/names', {
        cache: 'no-store',
      });

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeTaken));
      }

      if (!response.ok) {
        throw new Error('Failed to fetch table names');
      }

      const receivedObject: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      return data.map((item: { name: string }) => item.name);
    },
  });

  async function remove(hash: string) {
    await delay(5000);
    removeOperation(hash);
  }

  useEffect(() => {
    if (isFetching) return;

    (async () => {
      if (isError) {
        changeOperationStatus(
          hash.current,
          'error',
          'Failed to fetch table names',
          true
        );
        await remove(hash.current);

        return;
      }

      if (isSuccess && data) {
        setTableNames(data);
        setFetchStatus('success');

        changeOperationStatus(
          hash.current,
          'success',
          'Successfully fetched table names',
          false
        );
        await remove(hash.current);
      }
    })();
  }, [isFetching]);

  return (
    <>
      {fetchStatus === 'pending' && (
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
      {fetchStatus === 'success' && (
        <div className="w-full space-y-12 rounded-md border p-5">
          <TableNamesCombobox />
          <DeleteCheckBoxButton />
        </div>
      )}
    </>
  );
}

export { DeleteTable };
