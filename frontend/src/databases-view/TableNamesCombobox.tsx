import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const tableNames = tableNamesStore((state) => state.tableNames);
  const actions = tableNamesStore((state) => state.actions);
  const { setTableNames, resetTableNamesStore: resetTableNames } = actions;
  const { resetUserData } = userDataStore();
  // const { resetSearch } = searchStore();
  const resetSearch = searchStore((state) => state.actions.resetSeachStore);

  // const { selectedTableInfo, setSelectedTableInfo } = selectedTableInfoStore();
  const setSelectedTableName = selectedTableInfoStore(
    (state) => state.actions.setTableName
  );
  const selectedTableName = selectedTableInfoStore(
    (state) => state.props.tableName
  );

  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore();
  const hashRef = useRef(crypto.randomUUID());
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
    queryKey: ["tableNames"],
    queryFn: async () => {
      addOperation(
        hashRef.current,
        "pending",
        "fetch",
        "Fetching table names",
        false
      );

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
        changeOperationStatus(hashRef.current, "error", "fetch failed");
        remove(hashRef.current);

        return {};
      }

      const receivedObject: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      changeOperationStatus(
        hashRef.current,
        "success",
        "Table names fetch succeeded"
      );
      remove(hashRef.current);
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
    <div className="p-2.5">
      {fetchStatus === "pending" ? (
        <>
          <Skeleton className="h-[24px] w-[46px] mb-2" />
          <Skeleton className="h-[40px] w-full" />
        </>
      ) : null}

      {fetchStatus === "success" ? (
        <>
          <h1 className="mb-2">Tables</h1>
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
              <Command>
                <CommandInput placeholder="Search table..." />
                <CommandEmpty>No table found.</CommandEmpty>
                <ScrollArea className="max-h-[300px]">
                  <div>
                    <CommandGroup>
                      {tableNames.map((item) => (
                        <CommandItem
                          key={item}
                          value={item}
                          onSelect={(currentValue) => {
                            if (currentValue !== selectedTableName) {
                              resetSearch();
                              resetUserData();
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
        </>
      ) : null}
    </div>
  );
}

export default TableNamesCombobox;
