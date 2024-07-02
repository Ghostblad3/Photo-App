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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { columns } from "./columns";
import SearchValueCombobox from "./SearchValueCombobox";
import SearchFieldCombobox from "./SearchFieldCombobox";
import AddNewScreenshotDialog from "./AddNewScreenshotDialog";
import DeleteUserScreenshotDialog from "./DeleteUserScreenshotDialog";
import UpdateUserDialog from "./UpdateUserDialog";
import userDataStore from "./stores/userDataStore";
import searchStore from "./stores/searchStore";
import screenshotAsBase64Store from "./stores/screenshotAsBase64Store";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import addNewUserStore from "./stores/addNewUserStore";
import ScreenshotDialog from "./ScreenshotDialog";
import AddNewUserDialog from "./AddNewUserDialog";
import deleteUserScreenshotStore from "./stores/deleteUserScreenshotStore";
import updateUserInfoStore from "./stores/updateUserInfoStore";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";

export function DataTable<TData, TValue>() {
  const { userData, resetUserData } = userDataStore();
  // const { searchField, searchValue, setSearchValue } = searchStore();
  const searchField = searchStore((state) => state.props.searchField);
  const searchValue = searchStore((state) => state.props.searchValue);
  const setSearchValue = searchStore((state) => state.actions.setSearchValue);

  const {
    screenshotAsBase64Props: { displayDialog },
    setDisplayDialog,
    setParams,
  } = screenshotAsBase64Store();

  const showDialog = addNewScreenshotStore((state) => state.props.showDialog);
  const actions = addNewScreenshotStore((state) => state.actions);
  const { setTableName, setUserIdName, setUserId, setShowDialog } = actions;

  //const { selectedTableInfo } = selectedTableInfoStore();
  const tableName = selectedTableInfoStore((state) => state.props.tableName);

  const {
    addNewUserStoreProps: { addNewUserShowDialog },
    setAddNewUserStoreProps,
  } = addNewUserStore();
  const {
    deleteUserScreenshotStoreProps: { deleteUserScreenshotShowDialog },
    setDeleteUserScreenshotStoreProps,
  } = deleteUserScreenshotStore();
  const {
    updateUserInfoStoreProps: { updateUserInfoStoreShowDialog },
    setUpdateUserInfoStoreProps,
  } = updateUserInfoStore();

  useEffect(() => {
    return () => {
      resetUserData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const colSpan = 4;

  return (
    <div className="h-full">
      <div className="flex flex-wrap gap-2 mb-2.5">
        <SearchValueCombobox />
        <SearchFieldCombobox />
      </div>

      {showDialog ? <AddNewScreenshotDialog /> : null}

      {updateUserInfoStoreShowDialog ? <UpdateUserDialog /> : null}

      {deleteUserScreenshotShowDialog ? <DeleteUserScreenshotDialog /> : null}

      {addNewUserShowDialog ? <AddNewUserDialog /> : null}

      {displayDialog ? <ScreenshotDialog /> : null}

      <div ref={parentRef} className="px-2.5 w-full overflow-auto h-[400px]">
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
                        padding: "0rem 0.5rem",
                        paddingRight: "2.5rem",
                        textWrap: "nowrap",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "white",
                      }}
                      className="border-b border-gray-300 bg-gray-50 py-3 text-left text-sm font-semibold text-gray-900"
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
                      <td
                        key={cell.id}
                        className="font-medium cursor-pointer"
                        onDoubleClick={() => {
                          const keys: string[] = table
                            .getHeaderGroups()[0]
                            .headers.map((header) => header.id);

                          const user = userData[
                            row.id as unknown as number
                          ] as {
                            [key: string]: string;
                          };

                          if (user["has_screenshot"] === "no") {
                            return;
                          }

                          setParams(user, tableName, keys[0]);
                          setDisplayDialog(true);
                        }}
                      >
                        <ContextMenu>
                          <ContextMenuTrigger asChild>
                            <span
                              className="w-[100%] flex items-center leading-none"
                              style={{ height: `${virtualRow.size}px` }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </span>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-64">
                            <ContextMenuItem
                              inset
                              onClick={() => {
                                const keys: string[] = table
                                  .getHeaderGroups()[0]
                                  .headers.map((header) => header.id);

                                const [firstKey] = keys;

                                setTableName(tableName);
                                setShowDialog(true);
                                setUserIdName(firstKey);
                                setUserId(
                                  (
                                    userData[row.id as unknown as number] as {
                                      [key: string]: string;
                                    }
                                  )[firstKey]
                                );
                              }}
                            >
                              Add screenshot to user
                            </ContextMenuItem>
                            <ContextMenuItem
                              inset
                              onClick={() => {
                                setAddNewUserStoreProps({
                                  addNewUserShowDialog: true,
                                  tableName: tableName,
                                });
                              }}
                            >
                              Add new user
                            </ContextMenuItem>
                            <ContextMenuItem
                              inset
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
                                  tableName: tableName,
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
                                  tableName: tableName,
                                });
                              }}
                            >
                              Delete user screenshot
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
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
    </div>
  );
}

export default DataTable;
