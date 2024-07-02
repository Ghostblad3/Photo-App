import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import screenshotAsBase64Store from "./stores/screenshotAsBase64Store";
import operationStore from "../global-stores/operationStore";

function ScreenshotDialog() {
  const {
    screenshotAsBase64Props: {
      displayDialog,
      userInfo,
      keyName,
      tableName,
      screenshot,
    },
    setDisplayDialog,
    setScreenshot,
    resetScreenshotAsBase64Store,
  } = screenshotAsBase64Store();
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore();
  const hashRef = useRef(crypto.randomUUID());
  const [userScreenshotFetchStatus, setUserScreenshotFetchStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  useEffect(() => {
    if (userScreenshotFetchStatus === "error") {
      setDisplayDialog(false);
    }
  }, [userScreenshotFetchStatus, setDisplayDialog]);

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

      const timeNow = new Date();

      addOperation(
        hashRef.current,
        "pending",
        "fetch",
        "Fetching user screenshot",
        false
      );

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshot/${JSON.stringify(
          paramObj
        )}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const timeTaken = Date.now() - timeNow.getTime();

        if (timeTaken < 2000) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve("");
            }, 2000 - timeTaken);
          });
        }

        changeOperationStatus(
          hashRef.current,
          "error",
          "User screenshot fetch failed"
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

      const timeTaken = Date.now() - timeNow.getTime();

      if (timeTaken < 500) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve("");
          }, 500 - timeTaken);
        });
      }

      changeOperationStatus(
        hashRef.current,
        "success",
        "User screenshot fetch succeeded"
      );
      remove(hashRef.current);
      setUserScreenshotFetchStatus("success");
      setScreenshot(data);

      return {};
    },
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  return (
    <Dialog open={displayDialog}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={() => {
          setDisplayDialog(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>User screenshot</DialogTitle>
        </DialogHeader>
        <>
          {userScreenshotFetchStatus === "pending" ? (
            <div className="bg-slate-100 p-4">
              <Skeleton className="h-[100px] w-[105px] mx-auto rounded-lg bg-slate-200 shadow-custom">
                <div className="w-full h-full flex justify-center items-center bg-slate-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    color={"#9b9b9b"}
                    fill={"none"}
                    className="m-auto"
                  >
                    <path
                      d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16 22C15.3805 19.7749 13.9345 17.7821 11.8765 16.3342C9.65761 14.7729 6.87163 13.9466 4.01569 14.0027C3.67658 14.0019 3.33776 14.0127 3 14.0351"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 18C14.7015 16.6733 16.5345 15.9928 18.3862 16.0001C19.4362 15.999 20.4812 16.2216 21.5 16.6617"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Skeleton>
            </div>
          ) : (
            <div className="bg-slate-100 p-4">
              <img
                className="h-[100px] w-[105px] mx-auto rounded-lg "
                src={`data:image/png;base64,${screenshot}`}
              />
            </div>
          )}

          {Object.keys(userInfo).map((key) => (
            <div key={key} className="mx-4">
              <Label className="font-semibold block text-sm">{key}</Label>
              <Label className="text-gray-700 dark:text-gray-300 text-base">
                {userInfo[key]}
              </Label>
              <hr className="my-2" />
            </div>
          ))}
        </>
      </DialogContent>
    </Dialog>
  );
}

export default ScreenshotDialog;
