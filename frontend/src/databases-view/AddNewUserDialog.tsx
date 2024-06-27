import { useEffect, useRef, useState } from "react";
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
import operationStore from "./stores/operationStore";

function AddNewUserDialog() {
  const {
    addNewUserStoreProps: { addNewUserShowDialog, tableName },
    setAddNewUserShowDialog,
    resetAddNewUserStore,
  } = addNewUserStore((state) => ({
    addNewUserStoreProps: state.addNewUserStoreProps,
    setAddNewUserShowDialog: state.setAddNewUserShowDialog,
    resetAddNewUserStore: state.resetAddNewUserStore,
  }));

  const { userKeys, addUser } = userDataStore((state) => ({
    userKeys: state.userKeys,
    addUser: state.addUser,
  }));

  const { setStatus, setOperation } = operationStore((state) => ({
    setStatus: state.setStatus,
    setOperation: state.setOperation,
  }));

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

  const { refetch: addNewUser } = useQuery({
    queryKey: ["add-new-user"],
    queryFn: async () => {
      setOperation("create");
      setStatus("pending");

      setAddNewUserShowDialog(false);

      const response = await fetch(
        "http://localhost:3000/record/add-new-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableName,
            user: userRef.current,
          }),
        }
      );

      if (!response.ok) {
        setStatus("error");
        return {};
      }

      const result: {
        status: string;
        data: { [key: string]: string };
        error: { message: string };
      } = await response.json();

      const { status } = result;

      if (status !== "success") {
        setStatus("error");
        return {};
      }

      setStatus("success");
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

  function addNewUserButtonHandler() {
    addNewUser();
  }

  useEffect(() => {
    if (!Object.values(fieldsModified).some((value) => value === false)) {
      setButtonIsDisabled(false);
      return;
    }

    if (!buttonIsDisabled) setButtonIsDisabled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsModified]);

  return (
    <>
      <Dialog open={addNewUserShowDialog}>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={() => {
            setAddNewUserShowDialog(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add new user</DialogTitle>
          </DialogHeader>

          {keysRef.current.map((key) => {
            return (
              <div key={key} className="mx-4">
                <Label className="space-y-1 font-semibold block text-sm">
                  {key}
                </Label>
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
            disabled={buttonIsDisabled}
            onClick={addNewUserButtonHandler}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddNewUserDialog;
