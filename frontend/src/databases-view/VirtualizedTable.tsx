import { useState, useEffect, useRef } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Row,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useVirtualizer, notUndefined } from '@tanstack/react-virtual';
import { ImageOff, ImagePlus, PenLine, UserPlus, UserX } from 'lucide-react';
import { columns } from './columns';
import { useUserDataStore } from './stores/userDataStore';
import { useScreenshotStore } from './stores/screenshotStore';
import { useSelectedTableInfoStore } from './stores/selectedTableInfoStore';
import { useAddNewUserStore } from './stores/addNewUserStore';
import { useDeleteUserScreenshotStore } from './stores/deleteUserScreenshotStore';
import { useUpdateUserInfoStore } from './stores/updateUserInfoStore';
import { useAddNewScreenshotStore } from './stores/addNewScreenshotStore';
import { useDeleteUserStore } from './stores/deleteUserStore.ts';
import { SearchFieldCombobox } from './SearchFieldCombobox';
import { SearchValueCombobox } from './SearchValueCombobox';
import { Dialogs } from './Dialogs';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

function VirtualizedTable<TData, TValue>() {
  const filteredUserData = useUserDataStore(
    (state) => state.props.filteredUserData
  );
  const { resetUserData } = useUserDataStore((state) => state.actions);
  const {
    setShowDialog: setScreenshotShowDialog,
    setUserInfo: setScreenshotUserInfo,
    setTableName: setScreenshotTableName,
    setKeyName: setScreenshotKeyName,
  } = useScreenshotStore((state) => state.actions);
  const { setTableName, setUserIdName, setUserId, setShowDialog } =
    useAddNewScreenshotStore((state) => state.actions);
  const tableName = useSelectedTableInfoStore((state) => state.props.tableName);
  const {
    setShowDialog: setAddNewUserShowDialog,
    setTableName: setAddNewUserTableName,
  } = useAddNewUserStore((state) => state.actions);
  const {
    setShowDialog: setDeleteUserScreenshotShowDialog,
    setUserId: setDeleteUserScreenshotUserId,
    setUserIdName: setDeleteUserScreenshotUserIdName,
    setTableName: setDeleteUserScreenshotTableName,
  } = useDeleteUserScreenshotStore((state) => state.actions);
  const {
    setShowDialog: setUpdateUserInfoShowDialog,
    setTableName: setUpdateUserInfoTableName,
    setUserId: setUpdateUserInfoUserId,
    setUserIndex: setUpdateUserInfoUserIndex,
  } = useUpdateUserInfoStore((state) => state.actions);
  const { setProps } = useDeleteUserStore((state) => state.actions);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    return () => {
      resetUserData();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="size-full">
      <div className="m-2.5 flex flex-wrap gap-2">
        <SearchValueCombobox />
        <SearchFieldCombobox />
      </div>
      <Dialogs />
      <div ref={parentRef} className="m-2.5 h-[25rem] overflow-auto">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        paddingRight: '2.5rem',
                        textWrap: 'nowrap',
                        position: 'sticky',
                        zIndex: 999,
                        top: '0',
                        backgroundColor: 'white',
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
                      virtualRow.index % 2 === 0 ? '#edf2f4' : '',
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="cursor-pointer font-medium"
                        onDoubleClick={() => {
                          const keys: string[] = table
                            .getHeaderGroups()[0]
                            .headers.map((header) => header.id);

                          const user = filteredUserData[
                            row.id as unknown as number
                          ] as {
                            [key: string]: string;
                          };

                          if (user['has_screenshot'] === 'no') {
                            return;
                          }

                          setScreenshotUserInfo(user);
                          setScreenshotTableName(tableName);
                          setScreenshotKeyName(keys[0]);
                          setScreenshotShowDialog(true);
                        }}
                      >
                        <ContextMenu>
                          <ContextMenuTrigger asChild>
                            <div className="h-9 pb-[0.344rem] pl-4 pt-1">
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
                              <div className="flex items-center gap-5">
                                <ImagePlus className="size-4" />
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
                              <div className="flex items-center gap-5">
                                <UserPlus className="size-4" />
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
                              <div className="flex items-center gap-5">
                                <PenLine className="size-4" />
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
                                )['has_screenshot'] === 'no'
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
                              <div className="flex items-center gap-5">
                                <ImageOff className="size-4" />
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
                              <div className="flex items-center gap-5">
                                <UserX className="size-4" />
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

export { VirtualizedTable };
