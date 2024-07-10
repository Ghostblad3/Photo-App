import { useEffect, useRef, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import userDataStore from "./stores/userDataStore";
import deleteUserScreenshotStore from "./stores/deleteUserScreenshotStore";
import operationStore from "../global-stores/operationStore";

const DeleteUserScreenshotDialog = memo(() => {
  const { deleteUserScreenshot } = userDataStore((state) => state.actions);
  const showDialog = deleteUserScreenshotStore(
    (state) => state.props.showDialog
  );
  const userId = deleteUserScreenshotStore((state) => state.props.userId);
  const tableName = deleteUserScreenshotStore((state) => state.props.tableName);
  const userIdName = deleteUserScreenshotStore(
    (state) => state.props.userIdName
  );
  const { setShowDialog, resetDeleteUserScreenshotStore } =
    deleteUserScreenshotStore((state) => state.actions);

  const checkedBoxIsCheckedRef = useRef(false);
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);
  const hashRef = useRef(crypto.randomUUID());

  useEffect(() => {
    return () => {
      resetDeleteUserScreenshotStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { refetch: deleteUserQuery } = useQuery({
    queryKey: ["delete-user-screenshot", userId],
    queryFn: async () => {
      const paramData = {
        userIdName,
        userId,
        tableName,
      };

      setShowDialog(false);

      addOperation(
        hashRef.current,
        "pending",
        "delete",
        "Deleting user screenshot",
        true
      );

      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/screenshot/delete-user-screenshot/${JSON.stringify(
          paramData
        )}`,
        {
          method: "DELETE",
        }
      );

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeDiff));
      }

      if (!response.ok) {
        changeOperationStatus(
          hashRef.current,
          "error",
          "Failed to delete user screenshot",
          true
        );
        remove(hashRef.current);

        return {};
      }

      changeOperationStatus(
        hashRef.current,
        "success",
        "Successfully deleted user screenshot",
        true
      );
      remove(hashRef.current);
      deleteUserScreenshot(userIdName, userId);

      return {};
    },
    enabled: false,
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  function deleteUserScreenshotButtonHandler() {
    if (!checkedBoxIsCheckedRef.current) return;

    deleteUserQuery();
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

          <div className="flex items-center space-x-2 mx-4">
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
            className="w-[calc(100%_-_2rem)] mx-4"
            onClick={deleteUserScreenshotButtonHandler}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default DeleteUserScreenshotDialog;
