import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { Label } from "@/components/ui/label";
import operationStore from "@/global-stores/operationStore";
import dataStore from "./stores/dataStore";
import navitationStore from "./stores/navigationStore";

function CreateTable() {
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);
  const displayableData = dataStore((state) => state.props.displayableData);
  const resetDataStore = dataStore((state) => state.actions.resetDataStore);
  const { resetNagivationStore } = navitationStore((state) => state.actions);
  const setAllowRight = navitationStore((state) => state.actions.setAllowRight);

  const inputRef = useRef("");
  const tableHashRef = useRef(crypto.randomUUID());
  const usersHashRef = useRef(crypto.randomUUID());
  const [inputErrors, setInputErrors] = useState<{
    typeOne: boolean;
    typeTwo: boolean;
    typeThree: boolean;
  }>({ typeOne: false, typeTwo: false, typeThree: false });
  const [createTable, setCreateTable] = useState(false);
  const [createStatus, setCreateStatus] = useState<"nonpending" | "pending">(
    "nonpending"
  );

  useEffect(() => {
    setAllowRight(false);
  }, [setAllowRight]);

  useQuery({
    queryKey: ["create-table", inputRef.current],
    queryFn: async () => {
      setCreateStatus("pending");
      addOperation(
        tableHashRef.current,
        "pending",
        "create",
        "Creating a new user table",
        true
      );

      let time = Date.now();

      const keys = Object.keys(displayableData[0]);

      let response = await fetch("http://localhost:3000/table/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableName: inputRef.current,
          columnNames: keys,
        }),
      });

      let endTime = Date.now() - time;

      if (!response.ok) {
        if (endTime < 1000) {
          await new Promise((resolve) => setTimeout(resolve, 1000 - endTime));
        }

        if (response.status === 409) {
          changeOperationStatus(
            tableHashRef.current,
            "error",
            "Failed to create table, because table already exists",
            true
          );
        } else {
          changeOperationStatus(
            tableHashRef.current,
            "error",
            "Failed to create table",
            true
          );
        }

        setCreateTable(false);
        setCreateStatus("nonpending");
        remove(tableHashRef.current);

        return {};
      }

      if (endTime < 2000) {
        await new Promise((resolve) => setTimeout(resolve, 2000 - endTime));
      }

      changeOperationStatus(
        tableHashRef.current,
        "success",
        "Successfully created table",
        true
      );
      remove(tableHashRef.current);

      addOperation(
        usersHashRef.current,
        "pending",
        "create",
        "Creating new users in the table",
        true
      );

      time = Date.now();

      response = await fetch("http://localhost:3000/record/add-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users: displayableData,
          tableName: inputRef.current,
        }),
      });

      endTime = Date.now() - time;

      if (endTime < 2000) {
        await new Promise((resolve) => setTimeout(resolve, 2000 - endTime));
      }

      if (!response.ok) {
        changeOperationStatus(
          usersHashRef.current,
          "error",
          "Failed to add users to the table",
          true
        );
        setCreateTable(false);
        setCreateStatus("nonpending");
        remove(usersHashRef.current);

        return {};
      }

      changeOperationStatus(
        usersHashRef.current,
        "success",
        "Successfully added users to the table",
        true
      );
      remove(usersHashRef.current);

      resetDataStore();
      resetNagivationStore();

      return {};
    },
    enabled: createTable,
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  function inputHandler(e: ChangeEvent<HTMLInputElement>) {
    inputRef.current = e.target.value;
    const _input = inputRef.current;

    let inputErrors = { typeOne: false, typeTwo: false, typeThree: false };

    if (_input.length < 5 || _input.length > 20) {
      inputErrors = { ...inputErrors, typeOne: true };
    }

    if (_input.endsWith("_photos")) {
      inputErrors = { ...inputErrors, typeTwo: true };
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(_input)) {
      inputErrors = { ...inputErrors, typeThree: true };
    }

    setInputErrors(inputErrors);
  }

  function buttonHandler() {
    if (
      inputErrors.typeOne ||
      inputErrors.typeTwo ||
      inputErrors.typeThree ||
      createStatus === "pending"
    ) {
      return;
    }

    setCreateTable(true);
  }

  return (
    <div className="w-full border space-y-12 p-5 rounded-md">
      <div className="space-y-1">
        <h1 className="font-bold text-2xl decoration-slate-100">
          Create New Table
        </h1>
        <p className="text-slate-500">Enter a name for your new table.</p>
      </div>

      <div className="space-y-2.5 flex flex-col">
        <Label htmlFor="name" className="font-bold">
          Table Name
        </Label>
        <Input id="name" placeholder="Table name" onChange={inputHandler} />
        {inputErrors.typeOne && (
          <div className="flex gap-2.5">
            <CircleAlert className="flex-shrink-0 text-red-500" />
            <p className="text-red-500">
              The table name must be between 5 and 20 characters.
            </p>
          </div>
        )}
        {inputErrors.typeTwo && (
          <div className="flex gap-2.5">
            <CircleAlert className="flex-shrink-0 text-red-500" />
            <p className="text-red-500">
              The table name must not end with "_photos".
            </p>
          </div>
        )}
        {inputErrors.typeThree && (
          <div className="flex gap-2.5">
            <CircleAlert className="flex-shrink-0 text-red-500" />
            <p className="text-red-500">
              The table name must contain only letters, numbers, and
              underscores. It can only start with letters and underscores.
            </p>
          </div>
        )}
        <Button onClick={buttonHandler}>Create table</Button>
      </div>
    </div>
  );
}

export default CreateTable;
