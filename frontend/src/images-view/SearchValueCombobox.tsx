import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useSearchStore } from './stores/searchStore';
import { useUserDataStore } from './stores/userDataStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

function SearchValueCombobox() {
  const { setSearchValue, resetSearchStore } = useSearchStore(
    (state) => state.actions
  );
  const searchField = useSearchStore((state) => state.props.searchField);
  const searchValue = useSearchStore((state) => state.props.searchValue);
  const userData = useUserDataStore((state) => state.props.userData);
  const { setUserDataFiltered } = useUserDataStore((state) => state.actions);

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    return () => {
      resetSearchStore();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchField === '') {
      setUserDataFiltered(userData);
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
    if (searchValue === '') {
      setUserDataFiltered(userData);
      return;
    }

    setUserDataFiltered(
      userData.filter((user) => user[searchField] === searchValue)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className="flex w-full max-w-[18.75rem] p-2.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {searchValue !== ''
              ? values.find((item) => item.label === searchValue)?.label
              : `Select ${searchField}...`}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-width-full p-0">
          <Command shouldFilter={true}>
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
                          setSearchValue('');
                          setOpen(false);
                          return;
                        }

                        setSearchValue(item.label);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          searchValue === item.label
                            ? 'opacity-100'
                            : 'opacity-0'
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

export { SearchValueCombobox };
