import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import singleUserStore from "./stores/singleUserStore";
import { useEffect } from "react";

function ScreenshotDialog({ children }: { children: React.ReactNode }) {
  const { singleUserData, resetSingleUserData } = singleUserStore();

  useEffect(() => {
    return () => {
      resetSingleUserData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User information</DialogTitle>
        </DialogHeader>
        <div className="bg-slate-100 p-4">
          <img
            className="h-[100px] w-[105px] mx-auto rounded-md"
            src={`data:image/png;base64,${singleUserData["screenshot"]}`}
          />
        </div>

        {Object.keys(singleUserData)
          .filter((key) => key !== "screenshot")
          .map((key) => {
            return (
              <div key={key} className="mx-4">
                <Label className="font-semibold block text-sm">{key}</Label>
                <Label className="text-gray-700 dark:text-gray-300 text-base">
                  {singleUserData[key]}
                </Label>
                <hr className="my-2" />
              </div>
            );
          })}
      </DialogContent>
    </Dialog>
  );
}

export default ScreenshotDialog;
