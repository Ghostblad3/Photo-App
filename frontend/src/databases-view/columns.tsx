import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export type Data = {
  [key: string]: string;
};

export function columns(cols: Data[]) {
  if (cols.length === 0) return {};

  const keys = Object.keys(cols[0]);

  const tableCols: ColumnDef<Data>[] = keys.map((val) => {
    return {
      accessorKey: val,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {val}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
    };
  });

  return tableCols;
}
