import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import tableNamesStore from "./stores/tableNamesStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function TableNamesCombobox() {
  const tableNames = tableNamesStore((state) => state.props.tableNames);
  const selectedTableName = tableNamesStore(
    (state) => state.props.selectedTableName
  );
  const { setSelectedTableName } = tableNamesStore((state) => state.actions);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="space-y-1">
        <h1 className="font-bold text-2xl decoration-slate-100">
          Delete Table
        </h1>
        <p className="text-slate-500">
          Select the name of the table you want to delete.
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
  );
}

export default TableNamesCombobox;
