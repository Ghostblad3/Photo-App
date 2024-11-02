import { useState, useEffect, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Row,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useVirtualizer, notUndefined } from "@tanstack/react-virtual";
import { columns } from "../databases-view/columns";
import dataStore from "./stores/dataStore";
import navigationStore from "./stores/navigationStore";
import { Button } from "@/components/ui/button";

function Records<TData, TValue>() {
  const displayableData = dataStore((state) => state.props.displayableData);
  const allowLeft = navigationStore((state) => state.props.allowLeft);
  const allowRight = navigationStore((state) => state.props.allowRight);
  const { setAllowRight, setAllowLeft, incrementIndex } = navigationStore(
    (state) => state.actions
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: displayableData as TData[],
    columns: columns(displayableData) as ColumnDef<TData, TValue>[],
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 0,
  });
  const items = virtualizer.getVirtualItems();
  const [before, after] =
    items.length > 0
      ? [
          notUndefined(items[0]).start - virtualizer.options.scrollMargin,
          virtualizer.getTotalSize() -
            notUndefined(items[items.length - 1]).end,
        ]
      : [0, 0];
  const colSpan = 10;

  useEffect(() => {
    if (!allowLeft) {
      setAllowLeft(true);
    }

    if (!allowRight) {
      setAllowRight(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <div ref={parentRef} className="px-2.5 w-full overflow-auto h-[25rem]">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        paddingRight: "2.5rem",
                        textWrap: "nowrap",
                        position: "sticky",
                        zIndex: 999,
                        top: "0",
                        backgroundColor: "white",
                        // height: "30px",
                      }}
                      className="border-gray-300 bg-gray-50 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {before > 0 && (
              <tr>
                <td colSpan={colSpan} style={{ height: before }} />
              </tr>
            )}
            {items.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>;
              return (
                <tr
                  key={row.id}
                  style={{
                    // height: `${virtualRow.size}px`,
                    backgroundColor:
                      virtualRow.index % 2 === 0 ? "#edf2f4" : "",
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="font-medium">
                        <div className="pt-[0.25rem] pb-[0.344rem] pl-4 h-[2rem]">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {after > 0 && (
              <tr>
                <td colSpan={colSpan} style={{ height: after }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Button className="w-full mt-2.5" onClick={incrementIndex}>
        Create table
      </Button>
    </div>
  );
}

export default Records;
