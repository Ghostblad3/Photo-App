import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DragAndDropPngComponent from "./DragAndDropPngComponent";
import ImageCrop from "./ImageCrop";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";

function AddNewScreenshotDialog() {
  const {
    addNewScreenshotStoreProps: {
      screenshotAsBase64,
      addNewScreenshotShowDialog,
    },
    setAddNewScreenshotShowDialog,
    resetAddNewScreenshotStore,
  } = addNewScreenshotStore();

  useEffect(() => {
    return () => {
      resetAddNewScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={addNewScreenshotShowDialog}>
      <DialogContent
        className="sm:max-w-[825px]"
        onPointerDownOutside={() => {
          setAddNewScreenshotShowDialog(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Add new screenshot for user</DialogTitle>
        </DialogHeader>
        {screenshotAsBase64.length === 0 && <DragAndDropPngComponent />}
        {screenshotAsBase64.length > 0 && <ImageCrop />}
      </DialogContent>
    </Dialog>
  );
}

export default AddNewScreenshotDialog;
