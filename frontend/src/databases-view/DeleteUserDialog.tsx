import { useEffect, useRef } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useDeleteUserStore } from './stores/deleteUserStore.ts';
import { useUserDataStore } from './stores/userDataStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRemoveUser } from '@/queries/useRemoveUser.ts';

const DeleteUserDialog = () => {
  const props = useDeleteUserStore((state) => state.props);
  const { showDialog, userId, userIdName, tableName } = props;
  const { setShowDialog, resetDeleteUserStore } = useDeleteUserStore(
    (state) => state.actions
  );
  const deleteUser = useUserDataStore((state) => state.actions.deleteUser);
  const checkedBoxIsCheckedRef = useRef(false);
  const { mutate, isIdle, isPending, isSuccess, isError } = useRemoveUser(
    tableName,
    userId,
    userIdName
  );

  useEffect(() => {
    return () => {
      resetDeleteUserStore();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess) deleteUser(userIdName, userId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess || isError) setShowDialog(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  function deleteButtonHandler() {
    if (checkedBoxIsCheckedRef.current) mutate();
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
          <DialogTitle>Delete user</DialogTitle>
        </DialogHeader>
        <p className="mx-4">Are you sure you want to delete this user?</p>
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
          onClick={deleteButtonHandler}
          disabled={!isIdle}
        >
          {isPending && <ReloadIcon className="mr-2 size-4 animate-spin" />}
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteUserDialog };
