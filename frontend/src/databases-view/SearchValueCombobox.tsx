import { useEffect, useState } from "react";
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
import searchStore from "./stores/searchStore";
import userDataStore from "./stores/userDataStore";
import { ScrollArea } from "@/components/ui/scroll-area";

function SearchValueCombobox() {
  const [open, setOpen] = useState(false);
  const { searchField, searchValue, setSearchValue } = searchStore((state) => ({
    searchField: state.searchField,
    searchValue: state.searchValue,
    setSearchValue: state.setSearchValue,
  }));
  const userData = userDataStore((state) => state.userData);
  const [values, setValues] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (searchField === "") {
      setValues([]);
      return;
    }

    setValues(
      [
        ...new Set(
          (userData as { [key: string]: string }[]).map(
            (user) => user[searchField]
          )
        ),
      ].map((key) => {
        return { value: key.toLowerCase(), label: key };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchField]);

  return (
    <div className="p-2.5 flex gap-2 w-[300px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100%] justify-between"
          >
            {searchValue !== ""
              ? values.find((item) => item.label === searchValue)?.label
              : `Select ${searchField}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-width-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${searchField}...`} />
            <CommandEmpty>No {searchField} found.</CommandEmpty>
            <ScrollArea className="max-h-56">
              <div className="max-h-56">
                <CommandGroup>
                  {values.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        if (searchValue.toLowerCase() === currentValue) {
                          setSearchValue("");
                          setOpen(false);
                          return;
                        }

                        setSearchValue(item.label);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          searchValue === item.label
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchValueCombobox;