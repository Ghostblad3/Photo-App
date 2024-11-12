import { memo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "lucide-react";

import useOperationStore from "../global-stores/operationStore";

import useScreenshotStore from "./stores/screenshotStore";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ScreenshotDialog = memo(() => {
  const { showDialog, userInfo, keyName, tableName } = useScreenshotStore(
    (state) => state.props
  );
  const { setShowDialog, resetScreenshotStore } = useScreenshotStore(
    (state) => state.actions
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const hash = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    return () => {
      resetScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["screenshot", hash.current],
    queryFn: async () => {
      addOperation(
        hash.current,
        "pending",
        "fetch",
        "Fetching user screenshot",
        false
      );

      const timeNow = new Date();

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshot/${keyName}/${userInfo[keyName]}/${tableName}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user screenshot");
      }

      const timeDiff = Date.now() - timeNow.getTime();

      if (timeDiff < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeDiff));
      }

      const receivedObject: {
        status: string;
        data: string;
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      return data;
    },
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      modifyStatus(
        hash.current,
        "success",
        "Successfully fetched user screenshot",
        false
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      modifyStatus(
        hash.current,
        "error",
        "Failed to fetch user screenshot",
        true
      );

      setShowDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  async function modifyStatus(
    hash: string,
    status: "pending" | "success" | "error",
    message: string,
    show: boolean
  ) {
    changeOperationStatus(hash, status, message, show);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

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
          {isLoading && (
            <div className="bg-slate-100 p-4">
              <Skeleton className="shadow-custom mx-auto h-[6.25rem] max-w-[6.563rem] rounded-lg bg-slate-200">
                <div className="flex size-full items-center justify-center bg-slate-200">
                  <Image />
                </div>
              </Skeleton>
            </div>
          )}
          {isSuccess && (
            <div className="bg-slate-100 p-4">
              <img
                className="mx-auto h-[6.25rem] w-[6.563rem] rounded-lg "
                src={`data:image/png;base64,${data}`}
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

export default ScreenshotDialog;
