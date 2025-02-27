import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useOperationStore } from '../global-stores/operationStore';
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
import { delay } from '@/utils/delay';

function TableNamesCombobox() {
  const tableName = useSelectedTableStore((state) => state.props.tableName);
  const { setTableName, resetSelectedTableStore } = useSelectedTableStore(
    (state) => state.actions,
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);
  const tableNames = useTableNamesStore((state) => state.props.tableNames);
  const { setTableNames, resetTableNamesStore } = useTableNamesStore(
    (state) => state.actions,
  );

  const [open, setOpen] = useState(false);
  const [tableNamesFetchStatus, setTableNamesFetchStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');

  useEffect(() => {
    return () => {
      resetSelectedTableStore();
      resetTableNamesStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ['tableNames-image-view'],
    queryFn: async () => {
      const hash = crypto.randomUUID();
      addOperation(hash, 'pending', 'fetch', 'Fetching table names', false);

      const startTime = Date.now();

      const response = await fetch('http://localhost:3000/table/names', {
        cache: 'no-store',
      });

      if (!response.ok) {
        setTableNamesFetchStatus('error');
        changeOperationStatus(
          hash,
          'error',
          'Failed to fetch table names',
          true,
        );
        remove(hash);

        return {};
      }

      const receivedObject: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;
      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) {
        await delay(500, timeTaken);
      }

      changeOperationStatus(
        hash,
        'success',
        'Successfully fetched table names',
        false,
      );
      remove(hash);
      setTableNames(data.map((item: { name: string }) => item.name));
      setTableNamesFetchStatus('success');

      return receivedObject;
    },
  });

  async function remove(hash: string) {
    await delay(5000);
    removeOperation(hash);
  }

  return (
    <div className="p-2.5">
      {tableNamesFetchStatus === 'pending' && (
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
      {tableNamesFetchStatus !== 'pending' && (
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
                  disabled={tableNamesFetchStatus === 'error'}
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
