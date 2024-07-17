import { memo, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import userDataStore from "./stores/userDataStore";
import addNewUserStore from "./stores/addNewUserStore";
import operationStore from "../global-stores/operationStore";

const AddNewUserDialog = memo(() => {
  const userKeys = userDataStore((state) => state.props.userKeys);
  const { addUser } = userDataStore((state) => state.actions);
  const showDialog = addNewUserStore((state) => state.props.showDialog);
  const tableName = addNewUserStore((state) => state.props.tableName);
  const { setShowDialog, resetAddNewUserStore } = addNewUserStore(
    (state) => state.actions
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

  const keysRef = useRef(
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
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

  useEffect(() => {
    return () => {
      resetAddNewUserStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!Object.values(fieldsModified).some((value) => value === false)) {
      setButtonIsDisabled(false);
      return;
    }

    if (!buttonIsDisabled) setButtonIsDisabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsModified]);

  const { refetch: addNewUser } = useQuery({
    queryKey: ["add-new-user"],
    queryFn: async () => {
      setShowDialog(false);

      const hash = crypto.randomUUID();

      addOperation(hash, "pending", "create", "Creating a new user", true);

      const time = new Date();

      const response = await fetch("http://localhost:3000/record/add-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName,
          users: [userRef.current],
        }),
      });

      const timeDiff = Date.now() - time.getTime();

      if (timeDiff < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeDiff));
      }

      if (!response.ok) {
        changeOperationStatus(
          hash,
          "error",
          "Failed to create a new user",
          true
        );
        remove(hash);

        return {};
      }

      changeOperationStatus(
        hash,
        "success",
        "Successfully created a new user",
        true
      );
      remove(hash);

      addUser({
        ...userRef.current,
        has_screenshot: "no",
        screenshot_day: "-",
        photo_timestamp: "-",
      });

      return {};
    },
    enabled: false,
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  function addNewUserButtonHandler() {
    addNewUser();
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
          <DialogTitle>Add new user</DialogTitle>
        </DialogHeader>
        {keysRef.current.map((key) => {
          return (
            <div key={key} className="mx-4">
              <p className="space-y-1 font-semibold block text-sm">{key}</p>
              <Input
                className="mt-1"
                defaultValue={""}
                onChange={(e) => {
                  userRef.current[key] = e.target.value;

                  if (e.target.value.length > 0) {
                    setFieldsModified((prev) => ({ ...prev, [key]: true }));
                  } else {
                    setFieldsModified((prev) => ({ ...prev, [key]: false }));
                  }
                }}
              />
              {(fieldsModified[key] && userRef.current[key].length === 0) ||
                (userRef.current[key].length > 50 && (
                  <div className="flex items-center mt-2">
                    <CircleX className="text-red-500 mr-1 h-5 w-5" />
                    <Label className="text-red-500">
                      Field must be between 1 and 50 characters
                    </Label>
                  </div>
                ))}
            </div>
          );
        })}
        <Button
          className="w-[calc(100%_-_2rem)] mx-4"
          disabled={buttonIsDisabled}
          onClick={addNewUserButtonHandler}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
});

export default AddNewUserDialog;
