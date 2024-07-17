import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import tableNamesStore from "./stores/tableNamesStore";
import operationStore from "@/global-stores/operationStore";

function DeleteCheckBoxButton() {
  const selectedTableName = tableNamesStore(
    (state) => state.props.selectedTableName
  );
  const removeSelectedTable = tableNamesStore(
    (state) => state.actions.removeSelectedTable
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

  const [deleteTable, setDeleteTable] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"nopending" | "pending">(
    "nopending"
  );
  const [isChecked, setIsChecked] = useState(false);

  useQuery({
    queryKey: ["deleteTable"],
    queryFn: async () => {
      const hash = crypto.randomUUID();

      addOperation(hash, "pending", "delete", "Deleting table", true);

      const paramData = {
        tableName: selectedTableName,
      };

      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/table/delete/${JSON.stringify(paramData)}`,
        {
          method: "DELETE",
        }
      );

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeDiff));
      }

      if (!response.ok) {
        changeOperationStatus(hash, "error", "Failed to delete table", true);
        remove(hash);
        setDeleteStatus("nopending");
        setDeleteTable(false);

        return {};
      }

      removeSelectedTable();
      changeOperationStatus(
        hash,
        "success",
        "Successfully deleted table",
        true
      );
      remove(hash);
      setDeleteStatus("nopending");
      setDeleteTable(false);

      return {};
    },
    enabled: deleteTable && selectedTableName !== "",
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  function buttonHandler() {
    if (!isChecked || selectedTableName === "" || deleteStatus === "pending") {
      return;
    }

    setDeleteStatus("pending");
    setDeleteTable(true);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        <Checkbox
          id="checkbox"
          onCheckedChange={(e) => setIsChecked(e === true)}
        />
        <Label htmlFor="checkbox" className="font-semibold">
          I am sure i want to delete the selected table
        </Label>
      </div>
      <Button onClick={buttonHandler}>Delete table</Button>
    </div>
  );
}

export default DeleteCheckBoxButton;
