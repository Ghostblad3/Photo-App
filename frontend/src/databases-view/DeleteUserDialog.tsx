import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import deleteUserStore from "./stores/deleteUserStore";
import operationStore from "@/global-stores/operationStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

  const checkedBoxIsCheckedRef = useRef(false);
  const [allowDelete, setAllowDelete] = useState(false);

  useEffect(() => {
    return () => {
      resetDeleteUserStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ["add-new-user"],
    queryFn: async () => {
      setShowDialog(false);
      const hash = crypto.randomUUID();
      addOperation(hash, "pending", "delete", "Deleting user", true);

      const time = Date.now();

      const paramObject = {
        tableName,
        userId,
        userIdName,
      };

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
        changeOperationStatus(hash, "error", "Failed to delete user", true);
        remove(hash);

        return {};
      }

      deleteUser(userIdName, userId);

      changeOperationStatus(hash, "success", "Successfully deleted user", true);
      remove(hash);

      return {};
    },
    enabled: allowDelete,
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  function deleteButtonHandler() {
    if (checkedBoxIsCheckedRef.current) {
      setAllowDelete(true);
    }
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
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewUserDialog;
