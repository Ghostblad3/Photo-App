import { useEffect, useRef, memo } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useUserDataStore } from './stores/userDataStore';
import { useDeleteUserScreenshotStore } from './stores/deleteUserScreenshotStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDeleteUserScreenshot } from '@/queries/useDeleteUserScreenshot.ts';

const DeleteUserScreenshotDialog = memo(() => {
  const { deleteUserScreenshot } = useUserDataStore((state) => state.actions);
  const showDialog = useDeleteUserScreenshotStore(
    (state) => state.props.showDialog,
  );
  const userId = useDeleteUserScreenshotStore((state) => state.props.userId);
  const tableName = useDeleteUserScreenshotStore(
    (state) => state.props.tableName,
  );
  const userIdName = useDeleteUserScreenshotStore(
    (state) => state.props.userIdName,
  );
  const { setShowDialog, resetDeleteUserScreenshotStore } =
    useDeleteUserScreenshotStore((state) => state.actions);
  const checkedBoxIsCheckedRef = useRef(false);
  const { mutate, isPending, isError, isSuccess } = useDeleteUserScreenshot(userIdName, userId, tableName);

  useEffect(() => {
    return () => {
      resetDeleteUserScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess) deleteUserScreenshot(userIdName, userId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess || isError) setShowDialog(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  function deleteUserScreenshotButtonHandler() {
    if (!checkedBoxIsCheckedRef.current) return;

    mutate();
  }

  return (
    <Dialog open={showDialog}>
      <DialogContent
        className="sm:max-w-[26.563rem]"
        onPointerDownOutside={() => {
          setShowDialog(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete user screenshot</DialogTitle>
        </DialogHeader>
        <p className="mx-4">
          Are you sure you want to delete this user screenshot?
        </p>
        <div className="mx-4 flex items-center space-x-2">
          <Checkbox
            id="terms"
            onCheckedChange={() => {
              checkedBoxIsCheckedRef.current = true;
            }}
          />
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Yes I am sure
          </Label>
        </div>
        <Button
          className="mx-4 w-[calc(100%_-_2rem)]"
          onClick={deleteUserScreenshotButtonHandler}
          disabled={isPending}
        >
          {isPending && (
            <ReloadIcon className="mr-2 size-4 animate-spin" />
          )}
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
});

export { DeleteUserScreenshotDialog };
