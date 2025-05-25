import { useEffect, memo } from 'react';
import { DragAndDropPng } from './DragAndDropPng';
import { ImageCrop } from './ImageCrop';
import { useAddNewScreenshotStore } from './stores/addNewScreenshotStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AddNewScreenshotDialog = memo(() => {
  const screenshotAsBase64 = useAddNewScreenshotStore(
    (state) => state.props.screenshotAsBase64
  );
  const showDialog = useAddNewScreenshotStore(
    (state) => state.props.showDialog
  );
  const { setShowDialog, resetAddNewScreenshotStore } =
    useAddNewScreenshotStore((state) => state.actions);

  useEffect(() => {
    return () => {
      resetAddNewScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={showDialog} onOpenChange={(open) => setShowDialog(open)}>
      <DialogContent className="sm:max-w-[51.563rem]">
        <DialogHeader>
          <DialogTitle>Add new screenshot for user</DialogTitle>
        </DialogHeader>
        {screenshotAsBase64.length === 0 && <DragAndDropPng />}
        {screenshotAsBase64.length > 0 && <ImageCrop />}
      </DialogContent>
    </Dialog>
  );
});

export { AddNewScreenshotDialog };
