import { memo, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

import useOperationStore from "../global-stores/operationStore";

import useUpdateUserInfoStore from "./stores/updateUserInfoStore";
import useUserDataStore from "./stores/userDataStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UpdateUserDialog = memo(() => {
  const showDialog = useUpdateUserInfoStore((state) => state.props.showDialog);
  const userId = useUpdateUserInfoStore((state) => state.props.userId);
  const userIndex = useUpdateUserInfoStore((state) => state.props.userIndex);
  const tableName = useUpdateUserInfoStore((state) => state.props.tableName);
  const { setShowDialog, resetUpdateUserInfoStore } = useUpdateUserInfoStore(
    (state) => state.actions
  );
  const userData = useUserDataStore((state) => state.props.userData);
  const userKeys = useUserDataStore((state) => state.props.userKeys);
  const { updateUser } = useUserDataStore((state) => state.actions);
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const userObjRef = useRef<{ [key: string]: string }>(
    userData[parseInt(userIndex)]
  );
  const keysRef = useRef<string[]>(
    userKeys.filter(
      (key) =>
        key !== "has_screenshot" &&
        key !== "screenshot_day" &&
        key !== "photo_timestamp"
    )
  );
  const userRef = useRef<{ [key: string]: string }>(
    keysRef.current.reduce((acc: { [key: string]: string }, key) => {
      acc[key] = "";
      return acc;
    }, {})
  );
  const [fieldsModified, setFieldsModified] = useState<{
    [key: string]: boolean;
  }>(
    keysRef.current.reduce((acc: { [key: string]: boolean }, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const hash = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    return () => {
      resetUpdateUserInfoStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutation = useMutation({
    mutationFn: async (updatedUserProps: { [key: string]: string }) => {
      addOperation(
        hash.current,
        "pending",
        "update",
        "Updating user information",
        true
      );

      const time = Date.now();

      const result = await fetch("http://localhost:3000/record/update-user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: tableName,
          userId: userId,
          user: updatedUserProps,
        }),
      });

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeDiff));
      }

      if (!result.ok) {
        throw new Error("Failed to update user information");
      }
    },
    onError: () => {
      modifyStatus(
        hash.current,
        "error",
        "Failed to update user information",
        true
      );
    },
    onSuccess: (_, variables, __) => {
      updateUser(userId, variables);

      modifyStatus(
        hash.current,
        "success",
        "Successfully updated user information",
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

  function updateUserButtonHandler() {
    setButtonDisabled(true);

    const propsToUpdate: { [key: string]: string } = {};

    Object.keys(userRef.current).map((key) => {
      if (userObjRef.current[key] !== userRef.current[key]) {
        if (
          userRef.current[key].length > 0 &&
          userRef.current[key].length < 51
        ) {
          propsToUpdate[key] = userRef.current[key];
        } else {
          propsToUpdate[key] = userObjRef.current[key];
          userRef.current[key] = "";
        }
      } else {
        propsToUpdate[key] = userObjRef.current[key];
      }
    });

    mutation.mutate(propsToUpdate);
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
          <DialogTitle>Update user information</DialogTitle>
        </DialogHeader>
        {keysRef.current.map((key) => {
          return (
            <div key={key} className="mx-4">
              <p className="block space-y-1 text-sm font-semibold">{key}</p>
              <Input
                className="mt-1"
                defaultValue={userObjRef.current[key]}
                onChange={(e) => {
                  setFieldsModified((prev) => ({ ...prev, [key]: true }));
                  userRef.current[key] = e.target.value;
                }}
              />
              {(fieldsModified[key] && userRef.current[key].length === 0) ||
                (userRef.current[key].length > 50 && (
                  <div className="mt-2 flex items-center">
                    <CircleX className="mr-1 size-5 text-red-500" />
                    <Label className="text-red-500">
                      Field must be between 1 and 50 characters
                    </Label>
                  </div>
                ))}
            </div>
          );
        })}
        <Button
          className="mx-4 w-[calc(100%_-_2rem)]"
          onClick={updateUserButtonHandler}
          disabled={buttonDisabled}
        >
          {mutation.isPending && (
            <ReloadIcon className="mr-2 size-4 animate-spin" />
          )}
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
});

export default UpdateUserDialog;
