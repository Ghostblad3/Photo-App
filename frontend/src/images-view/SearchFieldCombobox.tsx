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
import { ScrollArea } from "@/components/ui/scroll-area";
import searchStore from "./stores/searchStore";
import userDataStore from "./stores/userDataStore";
import { Skeleton } from "@/components/ui/skeleton";

function SearchFieldCombobox() {
  const [open, setOpen] = useState(false);
  const { searchField, setSearchField, resetSearch } = searchStore((state) => ({
    searchField: state.searchField,
    setSearchField: state.setSearchField,
    resetSearch: state.resetSearch,
  }));
  const { userData, fetching } = userDataStore((state) => ({
    userData: state.userData,
    fetching: state.fetching,
  }));
  const [values, setValues] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    return () => {
      resetSearch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData.length === 0) return;

    const values = Object.keys((userData as { [key: string]: string }[])[0])
      .filter((key) => key !== "screenshot")
      .map((key) => {
        return { value: key.toLowerCase(), label: key };
      });

    setValues(values);
  }, [userData]);

  if (fetching)
    return (
      <div className="p-2.5 flex gap-2 w-[300px]">
        <div className="flex gap-2 mb-2.5 ">
          <Skeleton className="h-[40px] w-[200px]" />
        </div>
      </div>
    );

  return (
    <div className="p-2.5 w-[300px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100%] justify-between"
          >
            {searchField !== ""
              ? values.find((item) => item.label === searchField)?.label
              : `Select by column name...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-width-full p-0">
          <Command>
            <CommandInput placeholder={`Search by column name...`} />
            <CommandEmpty>No column name found.</CommandEmpty>
            <ScrollArea className="max-h-56">
              <div className="max-h-56">
                <CommandGroup>
                  {values.map((item) => (
                    <CommandItem
                      key={item.label}
                      value={item.label}
                      onSelect={(currentValue) => {
                        if (searchField.toLowerCase() === currentValue) {
                          setSearchField("");
                          setOpen(false);
                          return;
                        }

                        setSearchField(item.label);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          searchField === item.label
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

export default SearchFieldCombobox;
