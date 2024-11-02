import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import deleteUserStore from "./stores/deleteUserStore";
import operationStore from "@/global-stores/operationStore";
import userDataStore from "./stores/userDataStore";

const AddNewUserDialog = () => {
  const props = deleteUserStore((state) => state.props);
  const { showDialog, userId, userIdName, tableName } = props;
  const { setShowDialog, resetDeleteUserStore } = deleteUserStore(
    (state) => state.actions
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);
  const deleteUser = userDataStore((state) => state.actions.deleteUser);

  const hash = useRef(crypto.randomUUID());
  const checkedBoxIsCheckedRef = useRef(false);

  useEffect(() => {
    return () => {
      resetDeleteUserStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      addOperation(hash.current, "pending", "delete", "Deleting user", true);

      const paramObject = {
        tableName,
        userId,
        userIdName,
      };

      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/record/remove-user/${JSON.stringify(
          paramObject
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
        throw new Error("Failed to delete user");
      }
    },
    onError: () => {
      modifyStatus(hash.current, "error", "Failed to delete user", true);
    },
    onSuccess: () => {
      deleteUser(userIdName, userId);
      modifyStatus(hash.current, "success", "Successfully deleted user", true);
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

  function deleteButtonHandler() {
    if (!checkedBoxIsCheckedRef.current) return;

    mutation.mutate();
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
          onClick={deleteButtonHandler}
          disabled={!mutation.isIdle}
        >
          {mutation.isPending && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewUserDialog;
