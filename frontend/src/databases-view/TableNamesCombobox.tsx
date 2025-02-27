import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useOperationStore } from '../global-stores/operationStore';
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
import { Skeleton } from '@/components/ui/skeleton';
import { delay } from '@/utils/delay';

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
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const hash = useRef(crypto.randomUUID());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      resetTableNames();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['tableNames-databases-view', hash.current],
    queryFn: async () => {
      addOperation(
        hash.current,
        'pending',
        'fetch',
        'Fetching table names',
        false
      );

      const startTime = Date.now();

      const response = await fetch('http://localhost:3000/table/names', {
        cache: 'no-store',
      });

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) {
        await delay(500, timeTaken);
      }

      if (!response.ok) {
        throw new Error('Failed to fetch table names');
      }

      const receivedObject: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      return data.map((item) => item.name);
    },
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setTableNames(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    (async () => {
      if (isSuccess) {
        await modifyStatus(
          hash.current,
          'success',
          'Successfully fetched table names',
          false
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    (async () => {
      if (isError) {
        await modifyStatus(
          hash.current,
          'error',
          'Failed to fetch table names',
          true
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  async function modifyStatus(
    hash: string,
    status: 'pending' | 'success' | 'error',
    message: string,
    show: boolean
  ) {
    changeOperationStatus(hash, status, message, show);

    await delay(5000);

    removeOperation(hash);
  }

  return (
    <div className="w-full space-y-12 p-2.5">
      {isLoading && (
        <>
          <div className="space-y-1">
            <Skeleton className="h-8 max-w-[8.75rem]" />
            <Skeleton className="h-6 max-w-[21.188rem]" />
          </div>
          <div className="flex flex-col space-y-2.5">
            <Skeleton className="h-6 max-w-[5.625rem]" />
            <Skeleton className="h-10 max-w-full" />
          </div>
        </>
      )}
      {isSuccess && (
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
                  disabled={tableNames.length == 0}
                >
                  {selectedTableName !== ''
                    ? tableNames.find((item) => item === selectedTableName)
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
                        {tableNames.map((item) => (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={(currentValue) => {
                              if (currentValue !== selectedTableName) {
                                resetSearchStore();
                              }

                              setSelectedTableName(
                                currentValue === selectedTableName
                                  ? ''
                                  : currentValue
                              );

                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedTableName === item
                                  ? 'opacity-100'
                                  : 'opacity-0'
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
      )}
    </div>
  );
}

export { TableNamesCombobox };
