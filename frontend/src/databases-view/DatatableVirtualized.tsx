/* eslint-disable @typescript-eslint/no-unused-vars */
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { TableVirtuoso } from "react-virtuoso";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import SearchValueCombobox from "./SearchValueCombobox";
import SearchFieldCombobox from "./SearchFieldCombobox";
import DeleteUserScreenshotDialog from "./DeleteUserScreenshotDialog";
import UpdateUserDialog from "./UpdateUserDialog";
import AlertComponent from "./AlertComponent";
import userDataStore from "./stores/userDataStore";
import searchStore from "./stores/searchStore";
import screenshotAsBase64Store from "./stores/screenshotAsBase64Store";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import addNewUserStore from "./stores/addNewUserStore";
import ScreenshotDialog from "./ScreenshotDialog";
import AddNewUserDialog from "./AddNewUserDialog";
import deleteUserScreenshotStore from "./stores/deleteUserScreenshotStore";
import updateUserInfoStore from "./stores/updateUserInfoStore";
import modifyOperationStore from "./stores/modifyOperationStore";
import { columns } from "./columns";

// Original Table is wrapped with a <div> (see https://ui.shadcn.com/docs/components/table#radix-:r24:-content-manual),
// but here we don't want it, so let's use a new component with only <table> tag
const TableComponent = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
));
TableComponent.displayName = "TableComponent";

export function DataTable<TData, TValue>() {
  const { userData, resetUserData } = userDataStore((state) => ({
    userData: state.userData,
    resetUserData: state.resetUserData,
  }));
  const { searchField, searchValue, setSearchValue } = searchStore((state) => ({
    searchField: state.searchField,
    searchValue: state.searchValue,
    setSearchValue: state.setSearchValue,
    setSearchField: state.setSearchField,
  }));
  const {
    screenshotAsBase64Props: { displayDialog },
    setDisplayDialog,
    setParams,
  } = screenshotAsBase64Store((state) => ({
    screenshotAsBase64Props: state.screenshotAsBase64Props,
    setDisplayDialog: state.setDisplayDialog,
    setParams: state.setParams,
  }));
  const selectedTableInfo = selectedTableInfoStore(
    (state) => state.selectedTableInfo
  );
  const {
    addNewUserStoreProps: { addNewUserShowDialog },
    setAddNewUserStoreProps,
  } = addNewUserStore((state) => ({
    addNewUserStoreProps: state.addNewUserStoreProps,
    setAddNewUserStoreProps: state.setAddNewUserStoreProps,
  }));
  const {
    deleteUserScreenshotStoreProps: { deleteUserScreenshotShowDialog },
    setDeleteUserScreenshotStoreProps,
  } = deleteUserScreenshotStore((state) => ({
    deleteUserScreenshotStoreProps: state.deleteUserScreenshotStoreProps,
    setDeleteUserScreenshotStoreProps: state.setDeleteUserScreenshotStoreProps,
  }));
  const {
    updateUserInfoStoreProps: { updateUserInfoStoreShowDialog },
    setUpdateUserInfoStoreProps,
  } = updateUserInfoStore((state) => ({
    updateUserInfoStoreProps: state.updateUserInfoStoreProps,
    setUpdateUserInfoStoreProps: state.setUpdateUserInfoStoreProps,
  }));
  const { status, setStatus, resetModifyOpeation } = modifyOperationStore(
    (state) => ({
      status: state.status,
      setStatus: state.setStatus,
      resetModifyOpeation: state.resetModifyOpeation,
    })
  );

  useEffect(() => {
    return () => {
      resetModifyOpeation();
      resetUserData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (status === "success") {
      timeout = setTimeout(() => {
        setStatus("nop");
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (searchField === "") {
      setSearchValue("");
      table.resetColumnFilters(true);
      return;
    }

    table.getColumn(searchField)?.setFilterValue(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchField]);

  useEffect(() => {
    if (searchField === "" || searchValue === "") {
      table.resetColumnFilters(true);
      return;
    }

    table.getColumn(searchField)?.setFilterValue(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: userData as TData[],
    columns: columns(userData) as ColumnDef<TData, TValue>[],
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

  return (
    <div className="h-full">
      <div className="flex flex-wrap gap-2 mb-2.5">
        <SearchValueCombobox />
        <SearchFieldCombobox />
      </div>

      {status !== "nop" ? <AlertComponent /> : null}

      {updateUserInfoStoreShowDialog ? <UpdateUserDialog /> : null}

      {deleteUserScreenshotShowDialog ? <DeleteUserScreenshotDialog /> : null}

      {addNewUserShowDialog ? <AddNewUserDialog /> : null}

      {displayDialog ? <ScreenshotDialog /> : null}

      <div className="h-[400px] flex-grow">
        <div className="h-[calc(400px-10px)] px-2.5 overflow-y-auto">
          <TableVirtuoso
            className="overflow-y-auto bg-white border-[1px] rounded-md"
            totalCount={rows.length}
            components={{
              Table: TableComponent,
              TableRow: (props: HTMLAttributes<HTMLTableRowElement>) => {
                // @ts-expect-error data-index is a valid attribute
                const index = props["data-index"];
                const row = rows[index];

                if (!row) return null;

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    {...props}
                    className="font-medium cursor-pointer"
                    onDoubleClick={() => {
                      const keys: string[] = table
                        .getHeaderGroups()[0]
                        .headers.map((header) => header.id);

                      const user = userData[row.id as unknown as number] as {
                        [key: string]: string;
                      };

                      if (user["has_screenshot"] === "no") {
                        return;
                      }

                      setParams(user, selectedTableInfo.tableName, keys[0]);
                      setDisplayDialog(true);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`border-r-[1px] font-semibold`}
                      >
                        <ContextMenu>
                          <ContextMenuTrigger key={cell.id} asChild>
                            <div className="w-[100%] h-[100%]">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-64">
                            <ContextMenuItem
                              inset
                              onClick={() => {
                                setAddNewUserStoreProps({
                                  addNewUserShowDialog: true,
                                  tableName: selectedTableInfo.tableName,
                                });
                              }}
                            >
                              Add new user
                            </ContextMenuItem>
                            <ContextMenuItem
                              inset
                              //disabled={userUpdateStatus.status === "pending"}
                              onClick={() => {
                                const keys: string[] = table
                                  .getHeaderGroups()[0]
                                  .headers.map((header) => header.id);

                                const [firstKey] = keys;

                                setUpdateUserInfoStoreProps({
                                  updateUserInfoStoreShowDialog: true,
                                  userId: (
                                    userData[row.id as unknown as number] as {
                                      [key: string]: string;
                                    }
                                  )[firstKey],
                                  userIndex: row.id,
                                  tableName: selectedTableInfo.tableName,
                                });
                              }}
                            >
                              Modify user information
                            </ContextMenuItem>
                            <ContextMenuItem
                              inset
                              disabled={
                                (
                                  userData[row.id as unknown as number] as {
                                    [key: string]: string;
                                  }
                                )["has_screenshot"] === "no"
                              }
                              onClick={() => {
                                const keys: string[] = table
                                  .getHeaderGroups()[0]
                                  .headers.map((header) => header.id);

                                const [firstKey] = keys;

                                setDeleteUserScreenshotStoreProps({
                                  deleteUserScreenshotShowDialog: true,
                                  userId: (
                                    userData[row.id as unknown as number] as {
                                      [key: string]: string;
                                    }
                                  )[firstKey],
                                  userIdName: firstKey,
                                  tableName: selectedTableInfo.tableName,
                                });
                              }}
                            >
                              Delete user screenshot
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              },
            }}
            fixedHeaderContent={() =>
              table.getHeaderGroups().map((headerGroup) => (
                // Change header background color to non-transparent
                <TableRow
                  className="bg-card hover:bg-muted"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className="flex items-center"
                            {...{
                              style: header.column.getCanSort()
                                ? {
                                    cursor: "pointer",
                                    userSelect: "none",
                                  }
                                : {},
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))
            }
          />
        </div>
      </div>
    </div>
  );
}
