import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteCheckBoxButton from "./DeleteCheckBoxButton";
import TableNamesCombobox from "./TableNamesCombobox";
import tableNamesStore from "./stores/tableNamesStore";
import operationStore from "@/global-stores/operationStore";

function DeleteTable() {
  const { setTableNames, resetTableNamesStore } = tableNamesStore(
    (state) => state.actions
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

  const [fetchStatus, setFetchStatus] = useState<"pending" | "success">(
    "pending"
  );

  useEffect(() => {
    return () => {
      resetTableNamesStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ["tableNames-delete"],
    queryFn: async () => {
      const hash = crypto.randomUUID();

      addOperation(hash, "pending", "fetch", "Fetching table names", false);

      const startTime = Date.now();

      const response = await fetch("http://localhost:3000/table/names", {
        cache: "no-store",
      });

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) {
        await new Promise((resolve) => {
          setTimeout(resolve, 500 - timeTaken);
        });
      }

      if (!response.ok) {
        changeOperationStatus(
          hash,
          "error",
          "Failed to fetch table names",
          true
        );
        remove(hash);

        return {};
      }

      const receivedObject: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      changeOperationStatus(
        hash,
        "success",
        "Successfully fetched table names",
        false
      );
      remove(hash);
      setTableNames(data.map((item: { name: string }) => item.name));
      setFetchStatus("success");

      return {};
    },
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  return (
    <>
      {fetchStatus === "pending" && (
        <div className="w-full border space-y-12 p-5 rounded-md">
          <div className="space-y-1">
            <Skeleton className="h-8 max-w-[8.75rem]" />
            <Skeleton className="h-6 max-w-[21.188rem]" />
          </div>

          <div className="space-y-2.5 flex flex-col">
            <Skeleton className="h-6 max-w-[5.625rem]" />
            <Skeleton className="h-10 max-w-full" />
          </div>
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 max-w-[18.75rem]" />
            <Skeleton className="h-10 max-w-full" />
          </div>
        </div>
      )}

      {fetchStatus === "success" && (
        <div className="w-full border space-y-12 p-5 rounded-md">
          <TableNamesCombobox />

          <DeleteCheckBoxButton />
        </div>
      )}
    </>
  );
}

export default DeleteTable;
