import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOperationStore } from '../global-stores/operationStore';
import { VirtualizedTable } from './VirtualizedTable';
import { TableNamesCombobox } from './TableNamesCombobox';
import { Cards } from './Cards';
import { CardsSkeleton } from './CardsSkeleton';
import { VirtualizedTableSkeleton } from './VirtualizedTableSkeleton';
import { useUserDataStore } from './stores/userDataStore';
import { useSelectedTableInfoStore } from './stores/selectedTableInfoStore';
import { useSearchStore } from './stores/searchStore';
import { Button } from '@/components/ui/button';
import { throttle } from '@/utils/throttle';
import { delay } from '@/utils/delay';
import { fetchTableColumnNames } from '@/databases-view/fetchers/fetchers.ts';

function DatabasesView() {
  const tableName = useSelectedTableInfoStore((state) => state.props.tableName);
  const {
    setColumnNames,
    setUserNumber,
    setScreenshotNumber,
    setScreenshotAverageSize,
    resetSelectedTableInfoStore,
  } = useSelectedTableInfoStore((state) => state.actions);
  const { setUserData, setUserKeys, resetUserData } = useUserDataStore(
    (state) => state.actions
  );
  const resetSearchStore = useSearchStore(
    (state) => state.actions.resetSearchStore
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const hash = useRef('');
  const hash2 = useRef('');
  const [tableInfoFetchStatus, setTableInfoFetchStatus] = useState<
    'nop' | 'pending' | 'success' | 'error'
  >('nop');
  const [userRecordsFetchStatus, setUserRecordsFetchStatus] = useState<
    'nop' | 'pending' | 'success' | 'error'
  >('nop');
  const startTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      resetSelectedTableInfoStore();
      resetSearchStore();
      resetUserData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTableInfoFetchStatus('nop');
    setUserRecordsFetchStatus('nop');
    resetSearchStore();
    resetUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  const tableColumnNamesQuery = useQuery({
    queryKey: ['table-info-table-column-names', tableName],
    queryFn: async () => {
      startTimeRef.current = Date.now();
      setTableInfoFetchStatus('pending');
      hash.current = crypto.randomUUID();
      addOperation(
        hash.current,
        'pending',
        'fetch',
        'Fetching the selected table information.',
        true
      );

      return await fetchTableColumnNames(tableName);
    },
    enabled: tableName !== '',
    retry: false,
  });

  // const tableColumnNamesQuery = useQuery({
  //   queryKey: ['table-info-table-column-names', tableName],
  //   queryFn: async () => {
  //     startTimeRef.current = Date.now();
  //
  //     setTableInfoFetchStatus('pending');
  //
  //     hash.current = crypto.randomUUID();
  //
  //     addOperation(
  //       hash.current,
  //       'pending',
  //       'fetch',
  //       'Fetching the selected table information.',
  //       true
  //     );
  //
  //     const response = await fetch(
  //       `http://localhost:3000/table/table-column-names/${tableName}`,
  //       {
  //         cache: 'no-store',
  //       }
  //     );
  //
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch table column names');
  //     }
  //
  //     const {
  //       status,
  //       data,
  //     }: {
  //       status: string;
  //       data: string[];
  //       error: { message: string };
  //     } = await response.json();
  //
  //     if (status === 'error') {
  //       throw new Error('Failed to fetch table column names');
  //     }
  //
  //     return data;
  //   },
  //   enabled: tableName !== '',
  //   retry: false,
  // });
  const tableCountRecordsQuery = useQuery({
    queryKey: ['table-info-count-records', tableName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/table/count-records/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch record count');
      }

      const {
        status,
        data,
      }: {
        status: string;
        data: number;
        error: { message: string };
      } = await response.json();

      if (status === 'error') {
        throw new Error('Failed to fetch record count');
      }

      return data;
    },
    enabled: tableName !== '',
    retry: false,
  });

  const tableCountScreenshotsQuery = useQuery({
    queryKey: ['table-info-count-screenshots', tableName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/table/count-screenshots/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user screenshot count');
      }

      const {
        status,
        data,
      }: {
        status: string;
        data: number;
        error: { message: string };
      } = await response.json();

      if (status === 'error') {
        throw new Error('Failed to fetch user screenshot count');
      }

      return data;
    },
    enabled: tableName !== '',
    retry: false,
  });

  const tableScreenshotsSizeQuery = useQuery({
    queryKey: ['table-info-screenshots-size', tableName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/table/screenshots-size/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch screenshots size');
      }

      const {
        status,
        data,
      }: {
        status: string;
        data: number;
        error: { message: string };
      } = await response.json();

      if (status === 'error') {
        throw new Error('Failed to fetch screenshots size');
      }

      return data;
    },
    enabled: tableName !== '',
    retry: false,
  });

  useEffect(() => {
    if (tableName === '') return;

    if (
      tableColumnNamesQuery.isFetching ||
      tableCountRecordsQuery.isFetching ||
      tableCountScreenshotsQuery.isFetching ||
      tableScreenshotsSizeQuery.isFetching
    ) {
      return;
    }

    handleTableRecordsRequests();
  }, [
    tableColumnNamesQuery.isFetching,
    tableCountRecordsQuery.isFetching,
    tableCountScreenshotsQuery.isFetching,
    tableScreenshotsSizeQuery.isFetching,
  ]);

  async function handleTableRecordsRequests() {
    const timeTaken = Date.now() - startTimeRef.current;

    if (timeTaken < 500) {
      await delay(500, timeTaken);
    }

    if (
      !tableColumnNamesQuery.isSuccess ||
      !tableCountRecordsQuery.isSuccess ||
      !tableCountScreenshotsQuery.isSuccess ||
      !tableScreenshotsSizeQuery.isSuccess
    ) {
      changeOperationStatus(
        hash.current,
        'error',
        'Failed to fetch the selected table information',
        true
      );
      setTableInfoFetchStatus('error');
      await remove(hash.current);
      return;
    }

    setColumnNames(tableColumnNamesQuery.data);
    setUserNumber(tableCountRecordsQuery.data.toString());
    setScreenshotNumber(tableCountScreenshotsQuery.data.toString());
    setScreenshotAverageSize(tableScreenshotsSizeQuery.data.toString());
    setTableInfoFetchStatus('success');

    changeOperationStatus(
      hash.current,
      'success',
      'Successfully fetched the selected table information',
      false
    );
    await remove(hash.current);
  }

  const { isSuccess, isError, isFetching, data, refetch } = useQuery({
    queryKey: ['tableRecords', tableName],
    queryFn: async () => {
      setUserRecordsFetchStatus('pending');

      hash2.current = crypto.randomUUID();

      addOperation(
        hash2.current,
        'pending',
        'fetch',
        'Fetching user records',
        false
      );

      const time = Date.now();

      const firstRequestResponse = await fetch(
        `http://localhost:3000/record/get-user-data/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!firstRequestResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      let receivedObject: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await firstRequestResponse.json();

      const { data } = receivedObject;

      const secondRequestResponse = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-data-with-screenshots/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!secondRequestResponse.ok) {
        throw new Error('Failed to fetch user data with screenshots');
      }

      receivedObject = await secondRequestResponse.json();

      const { data: secondRequestData } = receivedObject;

      const userDataUpdated = data;
      const firstUser = data[0];

      const keys = Object.keys(firstUser)[0];
      const idKey = keys[0];

      userDataUpdated.forEach((user) => {
        const currUserWithScreenshotData = secondRequestData.find(
          (u) => u[idKey] === user[idKey]
        );

        if (currUserWithScreenshotData) {
          user.has_screenshot = 'yes';
          user.screenshot_day = currUserWithScreenshotData.dayNumber;
          user.photo_timestamp = new Date(
            currUserWithScreenshotData.photo_timestamp
          ).toLocaleString('it-IT');
        } else {
          user.has_screenshot = 'no';
          user.screenshot_day = '-';
          user.photo_timestamp = '-';
        }
      });

      const timeTaken = Date.now() - time;

      if (timeTaken < 500) {
        await delay(500, timeTaken);
      }

      return userDataUpdated;
    },
    enabled: false,
  });

  useEffect(() => {
    handleTableRecordsRequest();
  }, [isFetching]);

  async function handleTableRecordsRequest() {
    if (isError) {
      changeOperationStatus(
        hash2.current,
        'error',
        'Failed to fetch user records',
        true
      );

      setUserRecordsFetchStatus('error');
      resetSearchStore();
      resetUserData();
      await remove(hash2.current);

      return;
    }

    if (isSuccess && data) {
      const keys = Object.keys(data[0]);
      setUserKeys(keys);
      setUserData(data);

      setUserRecordsFetchStatus('success');

      changeOperationStatus(
        hash2.current,
        'success',
        'Successfully fetched user records',
        false
      );
      await remove(hash2.current);
    }
  }

  async function remove(hash: string) {
    await delay(5000);
    removeOperation(hash);
  }

  const throttledOperation = useMemo(() => {
    return throttle(async () => {
      await refetch();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-full w-full flex-col">
      <TableNamesCombobox />
      {tableInfoFetchStatus === 'pending' && <CardsSkeleton />}
      {tableInfoFetchStatus === 'success' && tableName.length !== 0 && (
        <Cards />
      )}
      {tableInfoFetchStatus === 'success' && tableName.length !== 0 && (
        <Button className="m-2" onClick={() => throttledOperation()}>
          Show records
        </Button>
      )}
      {userRecordsFetchStatus === 'pending' && <VirtualizedTableSkeleton />}
      {userRecordsFetchStatus === 'success' && tableName.length !== 0 && (
        <VirtualizedTable />
      )}
    </div>
  );
}

export { DatabasesView };
