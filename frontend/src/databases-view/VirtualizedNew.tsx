import { useState, useEffect, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Row,
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
import Dialogs from "./Dialogs";
import userDataStore from "./stores/userDataStore";
import screenshotAsBase64Store from "./stores/screenshotAsBase64Store";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import addNewUserStore from "./stores/addNewUserStore";
import deleteUserScreenshotStore from "./stores/deleteUserScreenshotStore";
import updateUserInfoStore from "./stores/updateUserInfoStore";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";
import deleteUserStore from "./stores/deleteUserStore";

export function DataTable<TData, TValue>() {
  const filteredUserData = userDataStore(
    (state) => state.props.filteredUserData
  );
  const { resetUserData } = userDataStore((state) => state.actions);
  const {
    setShowDialog: setScreenshowAsBase64ShowDialog,
    setUserInfo: setScreenshowAsBase64UserInfo,
    setTableName: setScreenshowAsBase64TableName,
    setKeyName: setScreenshotAsBase64KeyName,
  } = screenshotAsBase64Store((state) => state.actions);
  const { setTableName, setUserIdName, setUserId, setShowDialog } =
    addNewScreenshotStore((state) => state.actions);
  const tableName = selectedTableInfoStore((state) => state.props.tableName);
  const {
    setShowDialog: setAddNewUserShowDialog,
    setTableName: setAddNewUserTableName,
  } = addNewUserStore((state) => state.actions);
  const {
    setShowDialog: setDeleteUserScreenshotShowDialog,
    setUserId: setDeleteUserScreenshotUserId,
    setUserIdName: setDeleteUserScreenshotUserIdName,
    setTableName: setDeleteUserScreenshotTableName,
  } = deleteUserScreenshotStore((state) => state.actions);
  const {
    setShowDialog: setUpdateUserInfoShowDialog,
    setTableName: setUpdateUserInfoTableName,
    setUserId: setUpdateUserInfoUserId,
    setUserIndex: setUpdateUserInfoUserIndex,
  } = updateUserInfoStore((state) => state.actions);
  const { setProps } = deleteUserStore((state) => state.actions);

  useEffect(() => {
    return () => {
      resetUserData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: filteredUserData as TData[],
    columns: columns(filteredUserData) as ColumnDef<TData, TValue>[],
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
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

  if (filteredUserData.length === 0) {
    return null;
  }

  const colSpan = Object.keys(filteredUserData[0]).length;

  return (
    <div className="h-full">
      <div className="flex flex-wrap gap-2 m-2.5">
        <SearchValueCombobox />
        <SearchFieldCombobox />
      </div>
      <Dialogs />
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
                        // height: "1.875rem",
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
                      <td
                        key={cell.id}
                        className="font-medium cursor-pointer"
                        onDoubleClick={() => {
                          const keys: string[] = table
                            .getHeaderGroups()[0]
                            .headers.map((header) => header.id);

                          const user = filteredUserData[
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
                            <div className="pt-[0.25rem] pb-[0.344rem] pl-4 h-9">
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
                                    filteredUserData[
                                      row.id as unknown as number
                                    ] as {
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
                                    filteredUserData[
                                      row.id as unknown as number
                                    ] as {
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
                                  filteredUserData[
                                    row.id as unknown as number
                                  ] as {
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
                                    filteredUserData[
                                      row.id as unknown as number
                                    ] as {
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
                                  filteredUserData[
                                    row.id as unknown as number
                                  ] as {
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
