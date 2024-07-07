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
import { columns } from "./columns";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ImageOff, ImagePlus, PenLine, UserPlus, UserX } from "lucide-react";
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
import deleteUserStore from "./stores/deleteUserStore";
import DeleteUserDialog from "./DeleteUserDialog";

export function DataTable<TData, TValue>() {
  const userData = userDataStore((state) => state.props.userData);
  const { resetUserData } = userDataStore((state) => state.actions);
  const searchField = searchStore((state) => state.props.searchField);
  const searchValue = searchStore((state) => state.props.searchValue);
  const setSearchValue = searchStore((state) => state.actions.setSearchValue);
  const screenshowAsBase64ShowDialog = screenshotAsBase64Store(
    (state) => state.props.showDialog
  );
  const {
    setShowDialog: setScreenshowAsBase64ShowDialog,
    setUserInfo: setScreenshowAsBase64UserInfo,
    setTableName: setScreenshowAsBase64TableName,
    setKeyName: setScreenshotAsBase64KeyName,
  } = screenshotAsBase64Store((state) => state.actions);
  const addNewScreenshotShowDialog = addNewScreenshotStore(
    (state) => state.props.showDialog
  );
  const { setTableName, setUserIdName, setUserId, setShowDialog } =
    addNewScreenshotStore((state) => state.actions);
  const tableName = selectedTableInfoStore((state) => state.props.tableName);
  const addNewUserShowDialog = addNewUserStore(
    (state) => state.props.showDialog
  );
  const {
    setShowDialog: setAddNewUserShowDialog,
    setTableName: setAddNewUserTableName,
  } = addNewUserStore((state) => state.actions);
  const deleteUserScreenshotShowDialog = deleteUserScreenshotStore(
    (state) => state.props.showDialog
  );
  const {
    setShowDialog: setDeleteUserScreenshotShowDialog,
    setUserId: setDeleteUserScreenshotUserId,
    setUserIdName: setDeleteUserScreenshotUserIdName,
    setTableName: setDeleteUserScreenshotTableName,
  } = deleteUserScreenshotStore((state) => state.actions);
  const updateUserInfoShowDialog = updateUserInfoStore(
    (state) => state.props.showDialog
  );
  const {
    setShowDialog: setUpdateUserInfoShowDialog,
    setTableName: setUpdateUserInfoTableName,
    setUserId: setUpdateUserInfoUserId,
    setUserIndex: setUpdateUserInfoUserIndex,
  } = updateUserInfoStore((state) => state.actions);
  const deleteUserShowDialog = deleteUserStore(
    (state) => state.props.showDialog
  );
  const { setProps } = deleteUserStore((state) => state.actions);

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

      {addNewScreenshotShowDialog && <AddNewScreenshotDialog />}
      {updateUserInfoShowDialog && <UpdateUserDialog />}
      {deleteUserScreenshotShowDialog && <DeleteUserScreenshotDialog />}
      {deleteUserShowDialog && <DeleteUserDialog />}
      {addNewUserShowDialog && <AddNewUserDialog />}
      {screenshowAsBase64ShowDialog && <ScreenshotDialog />}

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
                        paddingTop: "0",
                        paddingRight: "2.5rem",
                        textWrap: "nowrap",
                        position: "sticky",
                        zIndex: 1,
                        top: "0",
                        backgroundColor: "white",
                        // height: "1.875rem",
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

                          setScreenshowAsBase64UserInfo(user);
                          setScreenshowAsBase64TableName(tableName);
                          setScreenshotAsBase64KeyName(keys[0]);

                          setScreenshowAsBase64ShowDialog(true);
                        }}
                      >
                        <ContextMenu>
                          <ContextMenuTrigger asChild>
                            <div className="pt-[0.25rem] pb-[0.344rem] pl-4 h-[2rem]">
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
                              <div className="flex gap-5 items-center">
                                <ImagePlus className="h-4 w-4" />
                                <span>Add screenshot to user</span>
                              </div>
                            </ContextMenuItem>
                            <ContextMenuItem
                              inset
                              onClick={() => {
                                setAddNewUserTableName(tableName);
                                setAddNewUserShowDialog(true);
                              }}
                            >
                              <div className="flex gap-5 items-center">
                                <UserPlus className="h-4 w-4" />
                                <span>Add new user</span>
                              </div>
                            </ContextMenuItem>
                            <ContextMenuItem
                              inset
                              onClick={() => {
                                const keys: string[] = table
                                  .getHeaderGroups()[0]
                                  .headers.map((header) => header.id);

                                const [firstKey] = keys;

                                setUpdateUserInfoTableName(tableName);
                                setUpdateUserInfoUserId(
                                  (
                                    userData[row.id as unknown as number] as {
                                      [key: string]: string;
                                    }
                                  )[firstKey]
                                );
                                setUpdateUserInfoUserIndex(row.id);
                                setUpdateUserInfoShowDialog(true);
                              }}
                            >
                              <div className="flex gap-5 items-center">
                                <PenLine className="h-4 w-4" />
                                <span>Modify user information</span>
                              </div>
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

                                setDeleteUserScreenshotUserId(
                                  (
                                    userData[row.id as unknown as number] as {
                                      [key: string]: string;
                                    }
                                  )[firstKey]
                                );
                                setDeleteUserScreenshotTableName(tableName);
                                setDeleteUserScreenshotUserIdName(firstKey);
                                setDeleteUserScreenshotShowDialog(true);
                              }}
                            >
                              <div className="flex gap-5 items-center">
                                <ImageOff className="h-4 w-4" />
                                <span>Delete user screenshot</span>
                              </div>
                            </ContextMenuItem>
                            <ContextMenuItem
                              inset
                              onClick={() => {
                                const keys: string[] = table
                                  .getHeaderGroups()[0]
                                  .headers.map((header) => header.id);

                                const [firstKey] = keys;

                                const userId = (
                                  userData[row.id as unknown as number] as {
                                    [key: string]: string;
                                  }
                                )[firstKey];

                                setProps(userId, firstKey, tableName);
                              }}
                            >
                              <div className="flex gap-5 items-center">
                                <UserX className="h-4 w-4" />
                                <span>Delete user</span>
                              </div>
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
