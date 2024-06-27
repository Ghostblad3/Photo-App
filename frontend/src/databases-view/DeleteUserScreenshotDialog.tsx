import { useEffect, useRef } from "react";
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
import operationStore from "./stores/operationStore";

function DeleteUserScreenshotDialog() {
  const deleteUserScreenshot = userDataStore(
    (state) => state.deleteUserScreenshot
  );
  const {
    deleteUserScreenshotStoreProps: {
      userId,
      userIdName,
      tableName,
      deleteUserScreenshotShowDialog,
    },
    setDeleteUserScreenshotShowDialog,
    resetDeleteUserScreenshotStore,
  } = deleteUserScreenshotStore((state) => ({
    deleteUserScreenshotStoreProps: state.deleteUserScreenshotStoreProps,
    setDeleteUserScreenshotShowDialog: state.setDeleteUserScreenshotShowDialog,
    resetDeleteUserScreenshotStore: state.resetDeleteUserScreenshotStore,
  }));
  const { setStatus, setOperation } = operationStore((state) => ({
    setStatus: state.setStatus,
    setOperation: state.setOperation,
  }));

  const checkedBoxIsCheckedRef = useRef(false);

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

      setOperation("delete");
      setStatus("pending");

      setDeleteUserScreenshotShowDialog(false);

      const response = await fetch(
        `http://localhost:3000/screenshot/delete-user-screenshot/${JSON.stringify(
          paramData
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setStatus("error");
        return {};
      }

      const result: {
        status: string;
        data: [];
        error: { message: string };
      } = await response.json();

      const { status } = result;

      if (status !== "success") {
        setStatus("error");
        return {};
      }

      setStatus("success");
      deleteUserScreenshot(userIdName, userId);

      return {};
    },
    enabled: false,
  });

  function deleteUserScreenshotButtonHandler() {
    if (!checkedBoxIsCheckedRef.current) return;

    deleteUserQuery();
  }

  return (
    <>
      <Dialog open={deleteUserScreenshotShowDialog}>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={() => {
            setDeleteUserScreenshotShowDialog(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Delete user screenshot</DialogTitle>
          </DialogHeader>

          <Label className="mx-4">
            Are you sure you want to delete this user screenshot?
          </Label>

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
}

export default DeleteUserScreenshotDialog;
