import { memo, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "lucide-react";
import screenshotAsBase64Store from "./stores/screenshotAsBase64Store";
import operationStore from "../global-stores/operationStore";

const ScreenshotDialog = memo(() => {
  const showDialog = screenshotAsBase64Store((state) => state.props.showDialog);
  const userInfo = screenshotAsBase64Store((state) => state.props.userInfo);
  const keyName = screenshotAsBase64Store((state) => state.props.keyName);
  const tableName = screenshotAsBase64Store((state) => state.props.tableName);
  const screenshotAsBase64 = screenshotAsBase64Store(
    (state) => state.props.screenshotAsBase64
  );
  const { setShowDialog, setScreenshotAsBase64, resetScreenshotAsBase64Store } =
    screenshotAsBase64Store((state) => state.actions);
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

  const hashRef = useRef(crypto.randomUUID());
  const [userScreenshotFetchStatus, setUserScreenshotFetchStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  useEffect(() => {
    if (userScreenshotFetchStatus === "error") {
      setShowDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userScreenshotFetchStatus]);

  useEffect(() => {
    return () => {
      resetScreenshotAsBase64Store();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ["screenshot", userInfo[keyName], tableName],
    queryFn: async () => {
      const paramObj = {
        userIdName: keyName,
        userId: userInfo[keyName],
        tableName: tableName,
      };

      addOperation(
        hashRef.current,
        "pending",
        "fetch",
        "Fetching user screenshot",
        false
      );

      const timeNow = new Date();

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshot/${JSON.stringify(
          paramObj
        )}`,
        {
          cache: "no-store",
        }
      );

      const timeDiff = Date.now() - timeNow.getTime();

      if (timeDiff < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeDiff));
      }

      if (!response.ok) {
        changeOperationStatus(
          hashRef.current,
          "error",
          "Failed to fetch user screenshot"
        );
        remove(hashRef.current);
        setUserScreenshotFetchStatus("error");

        resetScreenshotAsBase64Store();
        return {};
      }

      const receivedObject: {
        status: string;
        data: string;
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      changeOperationStatus(
        hashRef.current,
        "success",
        "Successfully fetched user screenshot"
      );
      remove(hashRef.current);
      setUserScreenshotFetchStatus("success");
      setScreenshotAsBase64(data);

      return {};
    },
  });

  async function remove(hash: string) {
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
          {userScreenshotFetchStatus === "pending" ? (
            <div className="bg-slate-100 p-4">
              <Skeleton className="h-[6.25rem] w-[6.563rem] mx-auto rounded-lg bg-slate-200 shadow-custom">
                <div className="w-full h-full flex justify-center items-center bg-slate-200">
                  <Image />
                </div>
              </Skeleton>
            </div>
          ) : (
            <div className="bg-slate-100 p-4">
              <img
                className="h-[6.25rem] w-[6.563rem] mx-auto rounded-lg "
                src={`data:image/png;base64,${screenshotAsBase64}`}
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
