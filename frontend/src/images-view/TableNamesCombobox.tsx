import { useEffect, useRef, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTableNamesStore } from './stores/tableNamesStore';
import { useSelectedTableStore } from './stores/selectedTableStore';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useTableNames } from '@/queries/useTableNames.ts';

function TableNamesCombobox() {
  const tableName = useSelectedTableStore((state) => state.props.tableName);
  const { setTableName, resetSelectedTableStore } = useSelectedTableStore(
    (state) => state.actions,
  );
  const tableNames = useTableNamesStore((state) => state.props.tableNames);
  const { setTableNames, resetTableNamesStore } = useTableNamesStore(
    (state) => state.actions,
  );

  const [open, setOpen] = useState(false);
  const hashRef = useRef(crypto.randomUUID());
  const { data, isFetching, isError } = useTableNames(hashRef.current);

  useEffect(() => {
    return () => {
      resetSelectedTableStore();
      resetTableNamesStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetching || isError) return;

    setTableNames(data!.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isFetching, isError]);

  return (
    <div className="p-2.5">
      {isFetching && (
        <div className="flex flex-col space-y-10">
          <div>
            <Skeleton className="mb-1 h-8 max-w-[2.875rem]" />
            <Skeleton className="h-6 max-w-full" />
          </div>
          <div className="flex flex-col space-y-2.5">
            <Skeleton className="h-6 max-w-[2.875rem]" />
            <Skeleton className="h-10 max-w-full" />
          </div>
        </div>
      )}
      {!isFetching && !isError && data && (
        <div className="flex flex-col space-y-10">
          <div>
            <h1 className="text-2xl font-bold decoration-slate-100">
              Select table
            </h1>
            <p className="text-slate-500">
              Select the name of the table that you want to work with
            </p>
          </div>
          <div className="flex flex-col space-y-2.5">
            <p className="font-bold">Table name</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {tableName !== ''
                    ? tableNames.find((item) => item === tableName)
                    : 'Select table...'}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command shouldFilter={true}>
                  <CommandInput placeholder="Search table..." />
                  <CommandEmpty>No table found.</CommandEmpty>
                  <CommandGroup>
                    {tableNames.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={(currentValue) => {
                          setTableName(
                            currentValue === tableName ? '' : currentValue,
                          );

                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            tableName === item ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}

export { TableNamesCombobox };
