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
import { Skeleton } from "@/components/ui/skeleton";

function SearchValueCombobox() {
  const [open, setOpen] = useState(false);
  const { searchField, searchValue, setSearchValue, resetSearch } = searchStore(
    (state) => ({
      searchField: state.searchField,
      searchValue: state.searchValue,
      setSearchValue: state.setSearchValue,
      resetSearch: state.resetSearch,
    })
  );
  const { userData, fetching, setUserDataFiltered } = userDataStore(
    (state) => ({
      userData: state.userData,
      fetching: state.fetching,
      setUserDataFiltered: state.setUserDataFiltered,
    })
  );
  const [values, setValues] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    return () => {
      resetSearch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUserDataFiltered(userData);

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

  useEffect(() => {
    if (searchValue === "") {
      setUserDataFiltered(userData);
      return;
    }

    setUserDataFiltered(
      userData.filter((user) => user[searchField] === searchValue)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  if (fetching)
    return (
      <div className="p-2.5 flex gap-2 w-[300px]">
        <div className="flex gap-2 mb-2.5 ">
          <Skeleton className="h-[40px] w-[200px]" />
        </div>
      </div>
    );

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
