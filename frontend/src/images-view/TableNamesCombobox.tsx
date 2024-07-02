import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import tableNamesStore from "./stores/tableNamesStore";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import operationStore from "../global-stores/operationStore";

function TableNamesCombobox() {
  const [open, setOpen] = useState(false);
  const tableNamesFetchRef = useRef(crypto.randomUUID());
  const tableNames = tableNamesStore((state) => state.tableNames);
  const {
    selectedTableInfo,
    setSelectedTableInfo,
    resetSelectedTableInfoStore,
  } = selectedTableInfoStore();
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore();
  const { setTableNames, resetTableNames } = tableNamesStore();
  const [tableNamesFetchStatus, setTableNamesFetchStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  useEffect(() => {
    return () => {
      resetSelectedTableInfoStore();
      resetTableNames();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ["tableNames"],
    queryFn: async () => {
      addOperation(
        tableNamesFetchRef.current,
        "pending",
        "fetch",
        "Fetching table names",
        true
      );

      const startTime = Date.now();

      const response = await fetch("http://localhost:3000/table/names", {
        cache: "no-store",
      });

      if (!response.ok) {
        setTableNamesFetchStatus("error");
        changeOperationStatus(
          tableNamesFetchRef.current,
          "error",
          "Table names fetch failed"
        );
        remove(tableNamesFetchRef.current);

        return {};
      }

      const receivedObject: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;
      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500)
        await new Promise((resolve) => {
          setTimeout(resolve, 500 - timeTaken);
        });

      changeOperationStatus(
        tableNamesFetchRef.current,
        "success",
        "Table names fetch succeeded"
      );
      remove(tableNamesFetchRef.current);
      setTableNames(data.map((item: { name: string }) => item.name));
      setTableNamesFetchStatus("success");

      return receivedObject;
    },
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  return (
    <div className="p-2.5">
      {tableNamesFetchStatus === "pending" ? (
        <>
          <Skeleton className="h-[24px] w-[46px] mb-2" />
          <Skeleton className="h-[40px] w-full" />
        </>
      ) : null}

      {tableNamesFetchStatus !== "pending" ? (
        <>
          <h1 className="mb-2">Tables</h1>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[100%] justify-between"
                disabled={tableNamesFetchStatus === "error"}
              >
                {selectedTableInfo.tableName !== ""
                  ? tableNames.find(
                      (tableName) => tableName === selectedTableInfo.tableName
                    )
                  : "Select table..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search table..." />
                <CommandEmpty>No table found.</CommandEmpty>
                <CommandGroup>
                  {tableNames.map((tableName) => (
                    <CommandItem
                      key={tableName}
                      value={tableName}
                      onSelect={(currentValue) => {
                        if (currentValue !== selectedTableInfo.tableName) {
                          // resetUserData();
                        }

                        setSelectedTableInfo(
                          currentValue === selectedTableInfo.tableName
                            ? { ...selectedTableInfo, tableName: "" }
                            : { ...selectedTableInfo, tableName: currentValue }
                        );

                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTableInfo.tableName === tableName
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {tableName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      ) : null}
    </div>
  );
}

export default TableNamesCombobox;
