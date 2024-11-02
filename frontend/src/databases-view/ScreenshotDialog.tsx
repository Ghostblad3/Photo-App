import { memo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "lucide-react";
import screenshotStore from "./stores/screenshotStore";
import operationStore from "../global-stores/operationStore";

const ScreenshotDialog = memo(() => {
  const { showDialog, userInfo, keyName, tableName } = screenshotStore(
    (state) => state.props
  );
  const { setShowDialog, resetScreenshotStore } = screenshotStore(
    (state) => state.actions
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

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

      const paramObj = {
        userIdName: keyName,
        userId: userInfo[keyName],
        tableName: tableName,
      };

      const timeNow = new Date();

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshot/${JSON.stringify(
          paramObj
        )}`,
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
              <Skeleton className="h-[6.25rem] max-w-[6.563rem] mx-auto rounded-lg bg-slate-200 shadow-custom">
                <div className="w-full h-full flex justify-center items-center bg-slate-200">
                  <Image />
                </div>
              </Skeleton>
            </div>
          )}
          {isSuccess && (
            <div className="bg-slate-100 p-4">
              <img
                className="h-[6.25rem] w-[6.563rem] mx-auto rounded-lg "
                src={`data:image/png;base64,${data}`}
              />
            </div>
          )}
          {Object.keys(userInfo).map((key) => (
            <div key={key} className="mx-4">
              <p className="font-semibold block text-sm">{key}</p>
              <p className="text-gray-700 dark:text-gray-300 text-base">
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
