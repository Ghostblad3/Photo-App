import { useEffect, useRef, memo } from "react";
import { useMutation } from "@tanstack/react-query";
import { ReloadIcon } from "@radix-ui/react-icons";

import useOperationStore from "../global-stores/operationStore";

import useUserDataStore from "./stores/userDataStore";
import useDeleteUserScreenshotStore from "./stores/deleteUserScreenshotStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DeleteUserScreenshotDialog = memo(() => {
  const { deleteUserScreenshot } = useUserDataStore((state) => state.actions);
  const showDialog = useDeleteUserScreenshotStore(
    (state) => state.props.showDialog
  );
  const userId = useDeleteUserScreenshotStore((state) => state.props.userId);
  const tableName = useDeleteUserScreenshotStore(
    (state) => state.props.tableName
  );
  const userIdName = useDeleteUserScreenshotStore(
    (state) => state.props.userIdName
  );
  const { setShowDialog, resetDeleteUserScreenshotStore } =
    useDeleteUserScreenshotStore((state) => state.actions);
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const checkedBoxIsCheckedRef = useRef(false);
  const hash = useRef(crypto.randomUUID());

  useEffect(() => {
    return () => {
      resetDeleteUserScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      addOperation(
        hash.current,
        "pending",
        "delete",
        "Deleting user screenshot",
        true
      );

      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/screenshot/delete-user-screenshot/${userIdName}/${userId}/${tableName}`,
        {
          method: "DELETE",
        }
      );

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeDiff));
      }

      if (!response.ok) {
        throw new Error("Failed to delete user screenshot");
      }
    },
    onError: () => {
      modifyStatus(
        hash.current,
        "error",
        "Failed to delete user screenshot",
        true
      );
    },
    onSuccess: () => {
      deleteUserScreenshot(userIdName, userId);

      modifyStatus(
        hash.current,
        "success",
        "Successfully deleted user screenshot",
        true
      );
    },
    onSettled: () => {
      setShowDialog(false);
    },
    retry: false,
  });

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

  function deleteUserScreenshotButtonHandler() {
    if (!checkedBoxIsCheckedRef.current) return;

    mutation.mutate();
  }

  return (
    <>
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
            disabled={!mutation.isIdle}
          >
            {mutation.isPending && (
              <ReloadIcon className="mr-2 size-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default DeleteUserScreenshotDialog;
