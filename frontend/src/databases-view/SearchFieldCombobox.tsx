import { useState } from 'react';
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

function SearchFieldCombobox() {
  const searchField = useSearchStore((state) => state.props.searchField);
  const { setSearchField, setSearchValue } = useSearchStore(
    (state) => state.actions,
  );
  const userData = useUserDataStore((state) => state.props.userData);

  const [open, setOpen] = useState(false);
  const [values] = useState(
    Object.keys((userData as { [key: string]: string }[])[0]).map((key) => {
      return { value: key.toLowerCase(), label: key };
    }),
  );

  return (
    <div className="w-[18.75rem]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {searchField !== ''
              ? values.find((item) => item.label === searchField)?.label
              : 'Select by column name...'}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-width-full p-0">
          <Command shouldFilter={true}>
            <CommandInput placeholder={'Search by column name...'} />
            <CommandEmpty>No column name found.</CommandEmpty>
            <ScrollArea className="max-h-56">
              <div className="max-h-56">
                <CommandGroup>
                  {values.map((item) => (
                    <CommandItem
                      key={item.label}
                      value={item.label}
                      onSelect={(currentValue) => {
                        setSearchValue('');

                        if (searchField.toLowerCase() === currentValue) {
                          setSearchField('');
                          setOpen(false);
                          return;
                        }

                        setSearchField(item.label);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          searchField === item.label
                            ? 'opacity-100'
                            : 'opacity-0',
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

export { SearchFieldCombobox };
