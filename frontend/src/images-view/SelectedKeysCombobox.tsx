import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { useAvailableKeysStore } from './stores/availableKeysStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

function SelectedKeysCombobox() {
  const selectedKeys = useAvailableKeysStore(
    (state) => state.props.selectedKeys
  );
  const availableKeys = useAvailableKeysStore(
    (state) => state.props.availableKeys
  );
  const { setAvailableKeys, setSelectedKeys, resetAvailableKeysStore } =
    useAvailableKeysStore((state) => state.actions);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    return () => {
      resetAvailableKeysStore();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newValues = [...new Set(availableKeys)].map((key) => {
      return { value: key.toLowerCase(), label: key };
    });

    const temp = [...selectedKeys];
    temp.sort((a, b) => {
      return (
        newValues.findIndex((item) => item.label === a) -
        newValues.findIndex((item) => item.label === b)
      );
    });

    setSelectedKeys(temp);
    setValues(newValues);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableKeys]);

  function handleReorder(key: string, direction: 'up' | 'down') {
    const index = availableKeys.indexOf(key);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === availableKeys.length - 1)
    )
      return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newKeys = [...availableKeys];
    const temp = newKeys[newIndex];
    newKeys[newIndex] = key;
    newKeys[index] = temp;

    setAvailableKeys(newKeys);
  }

  function handleSelect(key: string) {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      const selectedKeysOrdered = [...selectedKeys, key].sort((a, b) => {
        return (
          values.findIndex((item) => item.label === a) -
          values.findIndex((item) => item.label === b)
        );
      });
      setSelectedKeys(selectedKeysOrdered);
    }
    // Keep the popover open for multiple selections
  }

  function handleRemove(key: string) {
    setSelectedKeys(selectedKeys.filter((k) => k !== key));
  }

  return (
    <div className="space-y-4 p-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-slate-300 bg-white transition-colors hover:bg-slate-50"
          >
            <span className="text-slate-600">
              {selectedKeys.length > 0
                ? `${selectedKeys.length} field${selectedKeys.length > 1 ? 's' : ''} selected`
                : 'Select fields...'}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] border-slate-200 p-0 shadow-lg">
          <Command shouldFilter={true}>
            <CommandInput
              placeholder="Search fields..."
              className="border-b-0"
            />
            <div className="max-h-[250px] overflow-y-auto">
              <CommandList>
                <CommandEmpty className="py-6 text-center text-sm text-slate-500">
                  No field found.
                </CommandEmpty>
                <CommandGroup className="p-1.5">
                  {values.map((item) => (
                    <div
                      key={item.label}
                      className="mb-1 flex items-center last:mb-0"
                    >
                      <CommandItem
                        className={cn(
                          'flex-1 rounded-md transition-colors',
                          selectedKeys.includes(item.label)
                            ? 'bg-slate-100 text-slate-900'
                            : 'hover:bg-slate-50'
                        )}
                        value={item.label}
                        onSelect={() => handleSelect(item.label)}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-5 w-5 items-center justify-center rounded-sm border border-slate-300',
                            selectedKeys.includes(item.label)
                              ? 'bg-primary border-primary'
                              : 'opacity-70'
                          )}
                        >
                          {selectedKeys.includes(item.label) && (
                            <Check className="size-3.5 text-primary-foreground" />
                          )}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </CommandItem>
                      <div className="mx-1 flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-3.5 rounded-full hover:bg-slate-100"
                          onClick={() => handleReorder(item.label, 'up')}
                        >
                          <ArrowUp className="size-3 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-3.5 rounded-full hover:bg-slate-100"
                          onClick={() => handleReorder(item.label, 'down')}
                        >
                          <ArrowDown className="size-3 text-slate-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedKeys.length > 0 && (
        <div className="flex flex-wrap gap-2 duration-300 animate-in fade-in">
          {selectedKeys.map((key) => (
            <Badge
              key={key}
              variant="secondary"
              className="group gap-1.5 bg-slate-100 py-1.5 pl-3 pr-2 text-slate-800 transition-all hover:bg-slate-200"
            >
              <span className="text-sm font-medium">{key}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-4 rounded-full p-0 hover:bg-slate-300 hover:text-slate-900"
                onClick={() => handleRemove(key)}
              >
                <X className="size-3" />
                <span className="sr-only">Remove {key}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export { SelectedKeysCombobox };
