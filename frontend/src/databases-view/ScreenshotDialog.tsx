import { memo, useEffect, useRef } from 'react';
import { Image } from 'lucide-react';
import { useScreenshotStore } from './stores/screenshotStore';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRetrieveUserScreenshot } from '@/queries/useRetrieveUserScreenshot.ts';

const ScreenshotDialog = memo(() => {
  const { showDialog, userInfo, keyName, tableName } = useScreenshotStore(
    (state) => state.props,
  );
  const { setShowDialog, resetScreenshotStore } = useScreenshotStore(
    (state) => state.actions,
  );
  const hash = useRef<string>(crypto.randomUUID());
  const { data, isFetching, isError } = useRetrieveUserScreenshot(tableName, hash.current, keyName, userInfo);

  useEffect(() => {
    return () => {
      resetScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetching) return;

    if (isError) setShowDialog(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isFetching, isError]);

  return (
    <Dialog open={showDialog}>
      <DialogContent
        className="sm:max-w-[26.563rem]"
        onInteractOutside={() => {
          setShowDialog(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>User screenshot</DialogTitle>
        </DialogHeader>
        <>
          {isFetching && (
            <div className="bg-slate-100 p-4">
              <Skeleton className="mx-auto h-[6.25rem] max-w-[6.563rem] rounded-lg bg-slate-200 shadow-custom">
                <div className="flex size-full items-center justify-center bg-slate-200">
                  <Image />
                </div>
              </Skeleton>
            </div>
          )}
          {!isFetching && !isError && data && (
            <div className="bg-slate-100 p-4">
              <img
                className="mx-auto h-[6.25rem] w-[6.563rem] rounded-lg "
                src={`data:image/png;base64,${data.data}`}
                alt="user screenshot"
              />
            </div>
          )}
          {Object.keys(userInfo).map((key) => (
            <div key={key} className="mx-4">
              <p className="block text-sm font-semibold">{key}</p>
              <p className="text-base text-gray-700 dark:text-gray-300">
                {userInfo[key]}
              </p>
              <hr className="my-2" />
            </div>
          ))}
        </>
      </DialogContent>
    </Dialog>
  );
});

export { ScreenshotDialog };
