import { useEffect, useMemo, useRef, useState } from 'react';
//import { useOperationStore } from '../global-stores/operationStore';
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
import { useTableColumnNames } from '@/queries/useTableColumnNames.ts';
import { useTableCountRecords } from '@/queries/useTableCountRecords.ts';
import { useTableCountScreenshots } from '@/queries/useTableCountScreenshots.ts';
import { useTableScreenshotsSize } from '@/queries/useTableScreenshotsSize.ts';
import { useTableRecords } from '@/queries/useTableRecords.ts';

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
  const startTimeRef = useRef(0);
  const [showTable, setShowTable] = useState(false);

  const {
    data: tableColumnNamesData,
    isFetching: tableColumnNamesFetching,
    isError: tableColumnNamesError,
  } = useTableColumnNames(tableName, 500);
  const {
    data: tableCountRecordsData,
    isFetching: tableCountRecordsFetching,
    isError: tableCountRecordsError,
  } = useTableCountRecords(tableName);
  const {
    data: tableCountScreenshotsData,
    isFetching: tableCountScreenshotsFetching,
    isError: tableCountScreenshotsError,
  } = useTableCountScreenshots(tableName);
  const {
    data: tableScreenshotsSizeData,
    isFetching: tableScreenshotsSizeFetching,
    isError: tableScreenshotsSizeError,
  } = useTableScreenshotsSize(tableName);
  const {
    data: tableRecordsData,
    isError: tableRecordsError,
    isFetching: tableRecordsFetching,
    refetch,
  } = useTableRecords(tableName);

  useEffect(() => {
    return () => {
      resetSelectedTableInfoStore();
      resetSearchStore();
      resetUserData();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowTable(false);
    resetSearchStore();
    resetUserData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  const queriesFetching =
    tableColumnNamesFetching ||
    tableCountRecordsFetching ||
    tableCountScreenshotsFetching ||
    tableScreenshotsSizeFetching;
  const queriesFailed =
    tableColumnNamesError ||
    tableCountRecordsError ||
    tableCountScreenshotsError ||
    tableScreenshotsSizeError;
  const allQueriesData =
    tableColumnNamesData &&
    tableCountRecordsData &&
    tableCountScreenshotsData &&
    (tableScreenshotsSizeData as object | undefined);
  const queriesSucceeded = !queriesFetching && allQueriesData;

  useEffect(() => {
    if (tableName === '' || queriesFetching) return;

    handleTableRecordsRequests();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queriesFetching, queriesFailed, queriesSucceeded]);

  useEffect(() => {
    handleTableRecordsRequest();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRecordsData, tableRecordsFetching, tableRecordsError]);

  async function handleTableRecordsRequests() {
    const timeTaken = Date.now() - startTimeRef.current;

    if (timeTaken < 500) await delay(500, timeTaken);

    if (queriesFailed) return;

    setColumnNames(tableColumnNamesData!.data);
    setUserNumber(tableCountRecordsData!.data.toString());
    setScreenshotNumber(tableCountScreenshotsData!.data.toString());
    setScreenshotAverageSize(tableScreenshotsSizeData!.data.toString());
  }

  async function handleTableRecordsRequest() {
    if (tableRecordsError) {
      resetSearchStore();
      resetUserData();

      return;
    }

    if (tableRecordsData) {
      const keys = Object.keys(tableRecordsData!.data[0]);
      setUserKeys(keys);
      setUserData(tableRecordsData!.data);
    }
  }

  const throttledOperation = useMemo(() => {
    return throttle(async () => {
      setShowTable(true);
      startTimeRef.current = Date.now();
      await refetch();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-full w-full flex-col">
      <TableNamesCombobox />
      {queriesFetching && <CardsSkeleton />}
      {queriesSucceeded && tableName.length !== 0 && <Cards />}
      {queriesSucceeded && tableName.length !== 0 && (
        <Button className="m-2" onClick={() => throttledOperation()}>
          Show records
        </Button>
      )}
      {!queriesFetching && tableRecordsFetching && <VirtualizedTableSkeleton />}
      {showTable &&
        !tableRecordsFetching &&
        tableRecordsData &&
        tableName.length !== 0 && <VirtualizedTable />}
    </div>
  );
}

export { DatabasesView };
