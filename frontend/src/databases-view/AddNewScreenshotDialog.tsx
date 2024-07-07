import { useEffect, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DragAndDropPngComponent from "./DragAndDropPngComponent";
import ImageCrop from "./ImageCrop";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";

const AddNewScreenshotDialog = memo(() => {
  const screenshotAsBase64 = addNewScreenshotStore(
    (state) => state.props.screenshotAsBase64
  );
  const showDialog = addNewScreenshotStore((state) => state.props.showDialog);
  const { setShowDialog, resetAddNewScreenshotStore } = addNewScreenshotStore(
    (state) => state.actions
  );

  useEffect(() => {
    return () => {
      resetAddNewScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={showDialog}>
      <DialogContent
        className="sm:max-w-[51.563rem]"
        onPointerDownOutside={() => {
          setShowDialog(false);
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
});

export default AddNewScreenshotDialog;
