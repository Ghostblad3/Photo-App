import { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'lucide-react';
import { useOperationStore } from '../global-stores/operationStore';
import { ScreenshotDialog } from './ScreenshotDialog';
import { SelectedKeysCombobox } from './SelectedKeysCombobox';
import { SearchValueCombobox } from './SearchValueCombobox';
import { SearchFieldCombobox } from './SearchFieldCombobox';
import { useSelectedTableStore } from './stores/selectedTableStore';
import { useUserDataStore } from './stores/userDataStore';
import { useSingleUserStore } from './stores/singleUserStore';
import { useAvailableKeysStore } from './stores/availableKeysStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { delay } from '@/utils/delay';

function Grid() {
  const selectedKeys = useAvailableKeysStore(
    (state) => state.props.selectedKeys
  );
  const { setAvailableKeys } = useAvailableKeysStore((state) => state.actions);
  const tableName = useSelectedTableStore((state) => state.props.tableName);
  const userData = useUserDataStore((state) => state.props.userData);
  const userDataFiltered = useUserDataStore(
    (state) => state.props.userDataFiltered
  );
  const userKeys = useUserDataStore((state) => state.props.userKeys);
  const { setUserData, resetUserDataStore } = useUserDataStore(
    (state) => state.actions
  );
  const { setSingleUserData } = useSingleUserStore((state) => state.actions);
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const [count, setCount] = useState(0);
  const [fetchUserDataStatus, setFetchUserDataStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');

  useEffect(() => {
    return () => {
      resetUserDataStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ['user-data', tableName],
    queryFn: async () => {
      const hash = crypto.randomUUID();

      addOperation(hash, 'pending', 'fetch', 'Fetching user data', true);

      const startTime = Date.now();

      const countResponse = await fetch(
        `http://localhost:3000/table/count-screenshots/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!countResponse.ok) {
        changeOperationStatus(hash, 'error', 'Failed to fetch user data', true);
        await remove(hash);
        setFetchUserDataStatus('error');

        resetUserDataStore();
        return {};
      }

      const countResult: {
        status: string;
        data: number;
        error: { message: string };
      } = await countResponse.json();

      const { data: countData } = countResult;

      setCount(countData);

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshots-all-days/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        changeOperationStatus(hash, 'error', 'Failed to fetch user data', true);
        await remove(hash);
        setFetchUserDataStatus('error');

        resetUserDataStore();
        return {};
      }

      const result: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = result;

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) {
        await delay(500, timeTaken);
      }

      changeOperationStatus(
        hash,
        'success',
        'Successfully fetched user data',
        false
      );
      await remove(hash);

      if (data.length === 0) {
        resetUserDataStore();
        return {};
      }

      const firstObject = data[0];
      const keys = Object.keys(firstObject).filter(
        (key) => key !== 'screenshot'
      );

      setUserData(data);
      setAvailableKeys(keys);
      setFetchUserDataStatus('success');

      return {};
    },
    enabled: tableName !== '',
  });

  async function remove(hash: string) {
    await delay(5000);
    removeOperation(hash);
  }

  if (fetchUserDataStatus === 'error') {
    return (
      <div className="m-2.5 flex shrink-0">
        <span className="mx-auto">
          <Label className="text-xl">No data to display</Label>
        </span>
      </div>
    );
  }

  return (
    <>
      {fetchUserDataStatus === 'pending' && (
        <>
          <div className="p-2.5">
            <Skeleton className="h-10 max-w-full" />
          </div>
          <div className="mb-2.5 flex w-full flex-wrap gap-2 p-2.5">
            <Skeleton className="h-10 w-full max-w-[17.5rem]" />
            <Skeleton className="ml-5 h-10 w-full max-w-[17.5rem]" />
          </div>
        </>
      )}
      {fetchUserDataStatus === 'success' && (
        <>
          <SelectedKeysCombobox />
          <div className="mb-2.5 flex flex-wrap gap-2">
            <SearchValueCombobox />
            <SearchFieldCombobox />
          </div>
        </>
      )}
      <div className="grid-repeat-auto-fill-min-max m-2.5 grid gap-10">
        {fetchUserDataStatus === 'pending' && (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <Fragment key={index}>
                <Skeleton className="flex h-[16.125rem] flex-col rounded-lg bg-white p-2.5 shadow-custom">
                  <Skeleton className="mx-auto h-[6.25rem] w-[6.563rem] rounded-lg bg-slate-200">
                    <div className="flex size-full items-center justify-center rounded-lg bg-slate-200">
                      <Image />
                    </div>
                  </Skeleton>
                  <Skeleton className="mt-4 h-5 max-w-20" />
                  <Skeleton className="mt-4 h-5 max-w-28" />
                </Skeleton>
              </Fragment>
            ))}
          </>
        )}
        {fetchUserDataStatus === 'success' &&
          userDataFiltered.map((item: { [key: string]: string }) => {
            return (
              <ScreenshotDialog key={item[userKeys[0]]}>
                <div
                  key={item[userKeys[0]]}
                  className="flex cursor-pointer flex-col rounded-lg bg-white"
                  onClick={() => {
                    const key = userKeys[0];
                    const user = userData.find((u) => u[key] === item[key]);
                    if (user) {
                      setSingleUserData(user);
                    }
                  }}
                >
                  <div className="w-full rounded-t-lg bg-slate-200 py-5">
                    <img
                      className="mx-auto h-[6.25rem] w-[6.563rem] rounded-lg"
                      src={`data:image/png;base64,${item.screenshot}`}
                    />
                  </div>
                  {selectedKeys.map((key) => {
                    return (
                      <div
                        key={key}
                        className="mb-0.5 mt-1.5 flex flex-col px-1"
                      >
                        <p className="block cursor-pointer text-sm font-semibold">
                          {key}
                        </p>
                        <p className="cursor-pointer text-base text-gray-700 dark:text-gray-300">
                          {item[key]}
                        </p>
                        <hr className="my-2" />
                      </div>
                    );
                  })}
                </div>
              </ScreenshotDialog>
            );
          })}
      </div>
    </>
  );
}

export { Grid };
