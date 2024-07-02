/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import updateUserInfoStore from "./stores/updateUserInfoStore";
import userDataStore from "./stores/userDataStore";
import operationStore from "../global-stores/operationStore";

function UpdateUserDialog() {
  const {
    updateUserInfoStoreProps: {
      updateUserInfoStoreShowDialog,
      userId,
      userIndex,
      tableName,
    },
    setUpdateUserInfoShowDialog,
    resetUpdateUserInfoStore,
  } = updateUserInfoStore();
  const { userData, userKeys, updateUser } = userDataStore();
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore();
  const hashRef = useRef(crypto.randomUUID());

  const userToUpdateRef = useRef<{ [key: string]: string }>({});
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

  useEffect(() => {
    return () => {
      resetUpdateUserInfoStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { refetch: updateUserInfo } = useQuery({
    queryKey: ["updateUser", userToUpdateRef.current[keysRef.current[0]]],
    queryFn: async () => {
      setUpdateUserInfoShowDialog(false);

      addOperation(
        hashRef.current,
        "pending",
        "update",
        "Updating user information",
        true
      );

      const result = await fetch("http://localhost:3000/record/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: tableName,
          userId: userId,
          user: userToUpdateRef.current,
        }),
      });

      if (!result.ok) {
        changeOperationStatus(
          hashRef.current,
          "error",
          "Updating user information failed"
        );
        remove(hashRef.current);

        return {};
      }

      changeOperationStatus(
        hashRef.current,
        "success",
        "Updating user information successful"
      );
      remove(hashRef.current);
      updateUser(userId, userToUpdateRef.current);

      return {};
    },
    enabled: false,
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  function updateUserButtonHandler() {
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

    userToUpdateRef.current = propsToUpdate;

    updateUserInfo();
  }

  return (
    <Dialog open={updateUserInfoStoreShowDialog}>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={() => {
          setUpdateUserInfoShowDialog(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>Update user information</DialogTitle>
        </DialogHeader>
        {keysRef.current.map((key) => {
          return (
            <div key={key} className="mx-4">
              <Label className="space-y-1 font-semibold block text-sm">
                {key}
              </Label>
              <Input
                className="mt-1"
                defaultValue={userObjRef.current[key]}
                onChange={(e) => {
                  setFieldsModified((prev) => ({ ...prev, [key]: true }));
                  userRef.current[key] = e.target.value;
                }}
              />
              {(fieldsModified[key] && userRef.current[key].length === 0) ||
              userRef.current[key].length > 50 ? (
                <div className="flex items-center mt-2">
                  <CircleX className="text-red-500 mr-1 h-5 w-5" />
                  <Label className="text-red-500">
                    Field must be between 1 and 50 characters
                  </Label>
                </div>
              ) : null}
            </div>
          );
        })}

        <Button
          className="w-[calc(100%_-_2rem)] mx-4"
          onClick={updateUserButtonHandler}
        >
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateUserDialog;
