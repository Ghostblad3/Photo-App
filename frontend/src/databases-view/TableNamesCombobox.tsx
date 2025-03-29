import { useEffect, useRef, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTableNamesStore } from './stores/tableNamesStore';
import { useSearchStore } from './stores/searchStore';
import { useSelectedTableInfoStore } from './stores/selectedTableInfoStore';
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
import { TableNamesComboboxSkeleton } from '@/databases-view/TableNamesComboboxSkeleton.tsx';
import { useTableNames } from '@/queries/useTableNames.ts';

function TableNamesCombobox() {
  const tableNames = useTableNamesStore((state) => state.tableNames);
  const { setTableNames, resetTableNamesStore: resetTableNames } =
    useTableNamesStore((state) => state.actions);
  const resetSearchStore = useSearchStore(
    (state) => state.actions.resetSearchStore
  );
  const setSelectedTableName = useSelectedTableInfoStore(
    (state) => state.actions.setTableName
  );
  const selectedTableName = useSelectedTableInfoStore(
    (state) => state.props.tableName
  );
  const hash = useRef(crypto.randomUUID());
  const [open, setOpen] = useState(false);
  const { data, isFetching, isError } = useTableNames(hash.current);

  useEffect(() => {
    return () => {
      resetTableNames();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) setTableNames(data!.data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function comboBoxOnSelect(currentValue: string) {
    if (currentValue !== selectedTableName) resetSearchStore();

    setSelectedTableName(
      currentValue === selectedTableName.toLowerCase() ? '' : currentValue
    );

    setOpen(false);
  }

  const values = tableNames.map((tableName) => ({
    value: tableName.toLowerCase(),
    label: tableName,
  }));

  return (
    <div className="w-full space-y-12 p-2.5">
      {isFetching && <TableNamesComboboxSkeleton />}
      {!isFetching && !isError && (
        <>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold decoration-slate-100">
              Select table
            </h1>
            <p className="text-slate-500">
              Select the name of the table you want to work with
            </p>
          </div>
          <div className="flex flex-col space-y-2.5">
            <p className="font-bold">Table Name</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={tableNames.length === 0}
                >
                  {selectedTableName !== ''
                    ? values.find((item) => item.value === selectedTableName)
                        ?.label
                    : 'Select table...'}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command shouldFilter={true}>
                  <CommandInput placeholder="Search table..." />
                  <CommandEmpty>No table found.</CommandEmpty>
                  <ScrollArea className="max-h-[18.75rem]">
                    <div>
                      <CommandGroup>
                        {values.map((item) => (
                          <CommandItem
                            key={item.label}
                            value={item.label}
                            onSelect={comboBoxOnSelect}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedTableName === item.label
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
        </>
      )}
    </div>
  );
}

export { TableNamesCombobox };
