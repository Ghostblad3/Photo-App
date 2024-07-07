import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import useAvailableKeysStore from "./stores/availableKeysStore";

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
    setValues(
      [...new Set(availableKeys)].map((key) => {
        return { value: key.toLocaleLowerCase(), label: key };
      })
    );
  }, [availableKeys]);

  return (
    <div className="p-2.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100%] justify-between"
          >
            {"Select fields..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command shouldFilter={true}>
            {/* <CommandInput placeholder="Search fields..." /> */}
            <CommandEmpty>No field found.</CommandEmpty>
            <ScrollArea className="max-h-[18.75rem]">
              <CommandGroup>
                {values.map((item) => (
                  <div key={item.label} className="flex items-center">
                    <CommandItem
                      className="w-full"
                      value={item.label}
                      onSelect={() => {
                        if (
                          selectedKeys.some((selKey) => selKey === item.label)
                        ) {
                          setSelectedKeys(
                            selectedKeys.filter(
                              (selKey) => selKey !== item.label
                            )
                          );

                          return;
                        }

                        setSelectedKeys([...selectedKeys, item.label]);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedKeys.some((selKey) => selKey === item.label)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                    <div className="flex">
                      <ArrowUp
                        className="h-4 w-4 text-slate-400"
                        onClick={() => {
                          const index = availableKeys.indexOf(item.label);

                          if (index === 0) return;

                          const otherKey = availableKeys[index - 1];
                          const newKeys = [...availableKeys];

                          newKeys[index - 1] = item.label;
                          newKeys[index] = otherKey;

                          setAvailableKeys(newKeys);
                          setSelectedKeys(
                            newKeys.filter((key) => selectedKeys.includes(key))
                          );
                        }}
                      />
                      <ArrowDown
                        className="h-4 w-4 text-slate-400"
                        onClick={() => {
                          const index = availableKeys.indexOf(item.label);

                          if (index === availableKeys.length - 1) return;

                          const otherKey = availableKeys[index + 1];
                          const newKeys = [...availableKeys];

                          newKeys[index + 1] = item.label;
                          newKeys[index] = otherKey;

                          setAvailableKeys(newKeys);
                          setSelectedKeys(
                            newKeys.filter((key) => selectedKeys.includes(key))
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedKeys.length !== 0 ? (
        <div className="flex flex-wrap gap-2 mt-5">
          {selectedKeys.map((key) => (
            <div
              key={key}
              className="flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
            >
              <Label className="pl-2 pb-1">{key}</Label>
              <X
                className="h-4 w-4 hover:cursor-pointer"
                onClick={() => {
                  setSelectedKeys(
                    selectedKeys.filter((selKey) => selKey !== key)
                  );
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SelectedKeysCombobox;
