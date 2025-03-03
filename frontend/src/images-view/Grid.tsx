import { Fragment, useEffect, useState } from 'react';
import { Image } from 'lucide-react';
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
import { useUserScreenshotData } from '@/queries/useUserScreenshotData.ts';
import { useCountScreenshots } from '@/queries/useCountScreenshots.ts';

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
  const [count, setCount] = useState(0);

  const {
    data: countScreenshotsData,
    isFetching: countScreenshotsFetching,
    isError: countScreenshotsError,
  } = useCountScreenshots(tableName);
  const {
    data: userScreenshotData,
    isFetching: userScreenshotFetching,
    isError: userScreenshotError,
  } = useUserScreenshotData(tableName);

  useEffect(() => {
    return () => {
      resetUserDataStore();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryData = countScreenshotsData && userScreenshotData;
  const queryFetching =
    !queryData && (countScreenshotsFetching || userScreenshotFetching);
  const queryError =
    !queryFetching && (countScreenshotsError || userScreenshotError);

  useEffect(() => {
    if (queryFetching || queryError) return;

    setCount(countScreenshotsData!.data);

    if (userScreenshotData!.data.length === 0) {
      resetUserDataStore();
      return;
    }

    setUserData(userScreenshotData!.data!);
    setAvailableKeys(userScreenshotData!.keys!);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryData, queryFetching, queryError]);

  return (
    <>
      {queryFetching && (
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
      {queryError && (
        <div className="m-2.5 flex shrink-0">
          <span className="mx-auto">
            <Label className="text-xl">No data to display</Label>
          </span>
        </div>
      )}
      {queryData && (
        <>
          <SelectedKeysCombobox />
          <div className="mb-2.5 flex flex-wrap gap-2">
            <SearchValueCombobox />
            <SearchFieldCombobox />
          </div>
        </>
      )}
      <div className="grid-repeat-auto-fill-min-max m-2.5 grid gap-10">
        {queryFetching && (
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
        {queryData &&
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
                      alt={item.name}
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
