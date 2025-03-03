import { useEffect, memo, ReactNode } from 'react';
import { useSingleUserStore } from './stores/singleUserStore';
import { useAvailableKeysStore } from './stores/availableKeysStore';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ScreenshotDialog = memo(({ children }: { children: ReactNode }) => {
  const singleUserData = useSingleUserStore(
    (state) => state.props.singleUserData
  );
  const availableKeys = useAvailableKeysStore(
    (state) => state.props.availableKeys
  );

  const { resetSingleUserDataStore } = useSingleUserStore(
    (state) => state.actions
  );

  useEffect(() => {
    return () => {
      resetSingleUserDataStore();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[26.563rem]">
        <DialogHeader>
          <DialogTitle>User information</DialogTitle>
        </DialogHeader>
        <div className="bg-slate-100 p-4">
          <img
            className="mx-auto h-[6.25rem] w-[6.563rem] rounded-md"
            src={`data:image/png;base64,${singleUserData['screenshot']}`}
            alt={'Screenshot'}
          />
        </div>
        {availableKeys.map((key) => {
          return (
            <div key={key} className="mx-4">
              <p className="block text-sm font-semibold">{key}</p>
              <p className="text-base text-gray-700 dark:text-gray-300">
                {singleUserData[key]}
              </p>
              <hr className="my-2" />
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
});

export { ScreenshotDialog };
