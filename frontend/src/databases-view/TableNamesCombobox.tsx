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

function TableNamesCombobox() {
  const [open, setOpen] = useState(false);
  const { tableNames, setTableNames, resetTableNames } = tableNamesStore(
    (state) => ({
      tableNames: state.tableNames,
      setTableNames: state.setTableNames,
      resetTableNames: state.resetTableNames,
    })
  );
  const resetUserData = userDataStore((state) => state.resetUserData);
  const resetSearch = searchStore((state) => state.resetSearch);
  const { selectedTableInfo, setSelectedTableInfo } = selectedTableInfoStore(
    (state) => ({
      selectedTableInfo: state.selectedTableInfo,
      setSelectedTableInfo: state.setSelectedTableInfo,
    })
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
      const startTime = Date.now();

      const response = await fetch("http://localhost:3000/table/names", {
        cache: "no-store",
      });

      const timeTaken = Date.now() - startTime;

      if (!response.ok) {
        switch (response.status) {
          case 500:
        }

        return {};
      }

      const receivedObject: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      if (timeTaken < 500) {
        await new Promise((resolve) => {
          setTimeout(resolve, 500 - timeTaken);
        });
      }

      setTableNames(data.map((item: { name: string }) => item.name));

      return {};
    },
  });

  return (
    <div className="p-2.5">
      {tableNames.length === 0 ? (
        <>
          <Skeleton className="h-[24px] w-[46px] mb-2" />
          <Skeleton className="h-[40px] w-full" />
        </>
      ) : null}

      {tableNames.length !== 0 ? (
        <>
          <h1 className="mb-2">Tables</h1>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[100%] justify-between"
                disabled={true}
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
                <ScrollArea className="max-h-[300px]">
                  <div>
                    <CommandGroup>
                      {tableNames.map((tableName) => (
                        <CommandItem
                          key={tableName}
                          value={tableName}
                          onSelect={(currentValue) => {
                            if (currentValue !== selectedTableInfo.tableName) {
                              resetSearch();
                              resetUserData();
                            }

                            setSelectedTableInfo(
                              currentValue === selectedTableInfo.tableName
                                ? { ...selectedTableInfo, tableName: "" }
                                : {
                                    ...selectedTableInfo,
                                    tableName: currentValue,
                                  }
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
