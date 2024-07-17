import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import tableNamesStore from "./stores/tableNamesStore";
import userDataStore from "./stores/userDataStore";
import searchStore from "./stores/searchStore";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import operationStore from "../global-stores/operationStore";

function TableNamesCombobox() {
  const tableNames = tableNamesStore((state) => state.tableNames);
  const { setTableNames, resetTableNamesStore: resetTableNames } =
    tableNamesStore((state) => state.actions);
  const { resetUserData } = userDataStore((state) => state.actions);
  const resetSearchStore = searchStore(
    (state) => state.actions.resetSearchStore
  );
  const setSelectedTableName = selectedTableInfoStore(
    (state) => state.actions.setTableName
  );
  const selectedTableName = selectedTableInfoStore(
    (state) => state.props.tableName
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

  const [open, setOpen] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<"pending" | "success">(
    "pending"
  );

  useEffect(() => {
    return () => {
      resetTableNames();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ["tableNames-databases-view"],
    queryFn: async () => {
      const hash = crypto.randomUUID();

      addOperation(hash, "pending", "fetch", "Fetching table names", false);

      const startTime = Date.now();

      const response = await fetch("http://localhost:3000/table/names", {
        cache: "no-store",
      });

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeTaken));
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
    <div className="w-full space-y-12 p-2.5">
      {fetchStatus === "pending" && (
        <>
          <div className="space-y-1">
            <Skeleton className="h-8 max-w-[8.75rem]" />
            <Skeleton className="h-6 max-w-[21.188rem]" />
          </div>
          <div className="space-y-2.5 flex flex-col">
            <Skeleton className="h-6 max-w-[5.625rem]" />
            <Skeleton className="h-10 max-w-full" />
          </div>
        </>
      )}
      {fetchStatus === "success" && (
        <>
          <div className="space-y-1">
            <h1 className="font-bold text-2xl decoration-slate-100">
              Select table
            </h1>
            <p className="text-slate-500">
              Select the name of the table you want to work with
            </p>
          </div>
          <div className="space-y-2.5 flex flex-col">
            <p className="font-bold">Table Name</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[100%] justify-between"
                  disabled={tableNames.length == 0}
                >
                  {selectedTableName !== ""
                    ? tableNames.find((item) => item === selectedTableName)
                    : "Select table..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command shouldFilter={true}>
                  <CommandInput placeholder="Search table..." />
                  <CommandEmpty>No table found.</CommandEmpty>
                  <ScrollArea className="max-h-[18.75rem]">
                    <div>
                      <CommandGroup>
                        {tableNames.map((item) => (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={(currentValue) => {
                              if (currentValue !== selectedTableName) {
                                resetSearchStore();
                              }

                              setSelectedTableName(
                                currentValue === selectedTableName
                                  ? ""
                                  : currentValue
                              );

                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTableName === item
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </div>
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
}

export default TableNamesCombobox;
