import { useEffect, memo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import singleUserStore from "./stores/singleUserStore";
import availableKeysStore from "./stores/availableKeysStore";

const ScreenshotDialog = memo(({ children }: { children: React.ReactNode }) => {
  const singleUserData = singleUserStore((state) => state.props.singleUserData);
  const availableKeys = availableKeysStore(
    (state) => state.props.availableKeys
  );

  const { resetSingleUserDataStore } = singleUserStore(
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
            className="h-[6.25rem] w-[6.563rem] mx-auto rounded-md"
            src={`data:image/png;base64,${singleUserData["screenshot"]}`}
          />
        </div>
        {availableKeys.map((key) => {
          return (
            <div key={key} className="mx-4">
              <p className="font-semibold block text-sm">{key}</p>
              <p className="text-gray-700 dark:text-gray-300 text-base">
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

export default ScreenshotDialog;
