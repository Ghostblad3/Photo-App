import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import screenshotAsBase64Store from "./stores/screenshotAsBase64Store";

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
  } = screenshotAsBase64Store((state) => ({
    screenshotAsBase64Props: state.screenshotAsBase64Props,
    setDisplayDialog: state.setDisplayDialog,
    setScreenshot: state.setScreenshot,
    resetScreenshotAsBase64Store: state.resetScreenshotAsBase64Store,
  }));

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

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshot/${JSON.stringify(
          paramObj
        )}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setScreenshot("");

        return {};
      }

      const receivedObject: {
        status: string;
        data: string;
        error: { message: string };
      } = await response.json();

      const { status, data } = receivedObject;

      if (status === "error") {
        setScreenshot("");

        return {};
      }

      setScreenshot(data);

      return {};
    },
  });

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
        {screenshot.length > 0 ? (
          <>
            <div className="bg-slate-100 p-4">
              <img
                className="h-[100px] w-[105px] mx-auto"
                src={`data:image/png;base64,${screenshot}`}
              />
            </div>

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
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default ScreenshotDialog;
