import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useOperationStore from "../global-stores/operationStore";

import { DataTable } from "./VirtualizedNew";
import TableNamesCombobox from "./TableNamesCombobox";
import Cards from "./Cards";
import useUserDataStore from "./stores/userDataStore";
import useSelectedTableInfoStore from "./stores/selectedTableInfoStore";
import useSearchStore from "./stores/searchStore";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function Databases() {
  const tableName = useSelectedTableInfoStore((state) => state.props.tableName);
  const {
    setColumnNames,
    setUserNumber,
    setScreenshotNumber,
    setScreenshotAverageSize,
    resetSelectedTableInfoStore,
  } = useSelectedTableInfoStore((state) => state.actions);
  const { setUserData, setUserKeys, resetUserData } = useUserDataStore(
    (state) => state.actions
  );
  const resetSearchStore = useSearchStore(
    (state) => state.actions.resetSearchStore
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const [tableInfoFetchStatus, setTableInfoFetchStatus] = useState<
    "nop" | "pending" | "success" | "error"
  >("nop");
  const [userRecordsFetchStatus, setUserRecordsFetchStatus] = useState<
    "nop" | "pending" | "success" | "error"
  >("nop");

  useEffect(() => {
    return () => {
      resetSelectedTableInfoStore();
      resetUserData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTableInfoFetchStatus("nop");
    setUserRecordsFetchStatus("nop");
    resetUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  useQuery({
    queryKey: ["table-info", tableName],
    queryFn: async () => {
      setTableInfoFetchStatus("pending");

      const hash = crypto.randomUUID();

      addOperation(
        hash,
        "pending",
        "fetch",
        "Fetching the selected table information.",
        false
      );

      const startTime = Date.now();

      const fetchers: Promise<
        | {
            status: string;
            data: unknown;
            error: { message: string };
          }
        | string
      >[] = [
        new Promise((res, rej) => {
          const asyncOperation = async () => {
            const response = await genericFetch(
              `http://localhost:3000/table/table-column-names/${tableName}`
            );

            if (response === "error") {
              rej("error");
            }

            res(
              response as {
                status: string;
                data: unknown;
                error: { message: string };
              }
            );
          };

          try {
            asyncOperation();
          } catch (e) {
            rej("error");
          }
        }),
        new Promise((res, rej) => {
          const asyncOperation = async () => {
            const response = await genericFetch(
              `http://localhost:3000/table/count-records/${tableName}`
            );

            if (response === "error") {
              rej("error");
            }

            res(
              response as {
                status: string;
                data: unknown;
                error: { message: string };
              }
            );
          };

          try {
            asyncOperation();
          } catch (e) {
            rej("error");
          }
        }),
        new Promise((res, rej) => {
          const asyncOperation = async () => {
            const response = await genericFetch(
              `http://localhost:3000/table/count-screenshots/${tableName}`
            );

            if (response === "error") {
              rej("error");
            }

            res(
              response as {
                status: string;
                data: unknown;
                error: { message: string };
              }
            );
          };

          try {
            asyncOperation();
          } catch (e) {
            rej("error");
          }
        }),
        new Promise((res, rej) => {
          const asyncOperation = async () => {
            const response = await genericFetch(
              `http://localhost:3000/table/screenshots-size/${tableName}`
            );

            if (response === "error") {
              rej("error");
            }

            res(
              response as {
                status: string;
                data: unknown;
                error: { message: string };
              }
            );
          };

          try {
            asyncOperation();
          } catch (e) {
            rej("error");
          }
        }),
      ];

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) {
        await new Promise((resolve) => {
          setTimeout(resolve, 500 - timeTaken);
        });
      }

      const results = await Promise.all(fetchers);

      const [
        tableColumnNamesResult,
        countRecordsResult,
        countScreenshotsResult,
        averageScreenshotSizeResult,
      ] = results as {
        status: string;
        data: unknown;
        error: { message: string };
      }[];

      if (
        tableColumnNamesResult.status === "error" ||
        countRecordsResult.status === "error" ||
        countScreenshotsResult.status === "error" ||
        averageScreenshotSizeResult.status === "error"
      ) {
        changeOperationStatus(
          hash,
          "error",
          "Failed to fetch the selected table information",
          true
        );
        remove(hash);
        setTableInfoFetchStatus("error");

        return {};
      }

      changeOperationStatus(
        hash,
        "success",
        "Successfully fetched the selected table information",
        false
      );
      remove(hash);

      setColumnNames(tableColumnNamesResult.data as string[]);
      setUserNumber((countRecordsResult.data as number).toString());
      setScreenshotNumber((countScreenshotsResult.data as number).toString());
      setScreenshotAverageSize(
        (averageScreenshotSizeResult.data as number).toString()
      );
      setTableInfoFetchStatus("success");

      return {};
    },
    enabled: tableName !== "",
  });

  async function genericFetch(url: string): Promise<
    | {
        status: string;
        data: unknown;
        error: { message: string };
      }
    | "error"
  > {
    try {
      const response = await fetch(url, {
        cache: "no-store",
      });

      const result = (await response.json()) as {
        status: string;
        data: unknown;
        error: { message: string };
      };

      return result;
    } catch (e) {
      return "error";
    }
  }

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  const { refetch: fetchTableRecords } = useQuery({
    queryKey: ["tableRecords", tableName],
    queryFn: async () => {
      setUserRecordsFetchStatus("pending");

      const hash = crypto.randomUUID();

      addOperation(hash, "pending", "fetch", "Fetching user records", false);

      const time = Date.now();

      let response = await fetch(
        `http://localhost:3000/record/get-user-data/${tableName}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const timeTaken = Date.now() - time;

        if (timeTaken < 500) {
          await new Promise((resolve) => setTimeout(resolve, 500 - timeTaken));
        }

        changeOperationStatus(
          hash,
          "error",
          "Failed to fetch user records",
          true
        );
        remove(hash);
        setUserRecordsFetchStatus("error");

        resetUserData();
        return {};
      }

      let receivedObject: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = receivedObject;

      response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-data-with-screenshots/${tableName}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const timeTaken = Date.now() - time;

        if (timeTaken < 500) {
          await new Promise((resolve) => setTimeout(resolve, 500 - timeTaken));
        }

        changeOperationStatus(
          hash,
          "error",
          "Failed to fetch user records",
          true
        );
        remove(hash);
        setUserRecordsFetchStatus("error");

        resetUserData();
        return {};
      }

      receivedObject = await response.json();

      const { data: secondRequestData } = receivedObject;

      const userDataUpdated = data;
      const [firstUser] = data;

      const [idKey] = Object.keys(firstUser);

      userDataUpdated.forEach((user) => {
        const currUserWithScreenshotData = secondRequestData.find(
          (u) => u[idKey] === user[idKey]
        );

        if (currUserWithScreenshotData) {
          user.has_screenshot = "yes";
          user.screenshot_day = currUserWithScreenshotData.dayNumber;
          user.photo_timestamp = new Date(
            currUserWithScreenshotData.photo_timestamp
          ).toLocaleString("it-IT");
        } else {
          user.has_screenshot = "no";
          user.screenshot_day = "-";
          user.photo_timestamp = "-";
        }
      });

      const [user] = userDataUpdated;
      const keys = Object.keys(user);

      const timeTaken = Date.now() - time;

      if (timeTaken < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - timeTaken));
      }

      resetSearchStore();
      resetUserData();

      changeOperationStatus(
        hash,
        "success",
        "Successfully fetched user records",
        false
      );
      remove(hash);
      setUserRecordsFetchStatus("success");

      setUserKeys(keys);
      setUserData(userDataUpdated);

      return {};
    },
    enabled: false,
  });
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function throttle(mainFunction: () => void, delay: number) {
    let allow: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => {
      if (allow === false) {
        allow = true;
        mainFunction();
        setTimeout(() => {
          allow = false; // Clear the timerFlag to allow the main function to be executed again
        }, delay);
      }
    };
  }

  const throttledOperation = useMemo(() => {
    return throttle(() => fetchTableRecords(), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-full w-full flex-col">
      <TableNamesCombobox />
      {tableInfoFetchStatus === "pending" && (
        <>
          <div className="my-2 flex w-full items-center gap-2.5 pl-2.5">
            <Skeleton className="h-6 w-11 rounded-lg shadow-lg" />
            <Skeleton className="h-3.5 w-[9.25rem] shadow-lg" />
          </div>
          <div className="grid auto-rows-fr gap-5 p-2.5 lg:grid-cols-4">
            <Skeleton className="h-[6.875rem] rounded-lg shadow-lg" />
            <Skeleton className="h-[6.875rem] rounded-lg shadow-lg" />
            <Skeleton className="h-[6.875rem] rounded-lg shadow-lg" />
            <Skeleton className="h-[6.875rem] rounded-lg shadow-lg" />
          </div>
        </>
      )}
      {tableInfoFetchStatus === "success" && tableName.length !== 0 && (
        <Cards />
      )}
      {tableInfoFetchStatus === "success" && tableName.length !== 0 && (
        <Button className="m-2" onClick={() => throttledOperation()}>
          Show records
        </Button>
      )}
      {userRecordsFetchStatus === "pending" && (
        <div className="m-2.5 flex h-full max-w-full flex-col">
          <div className="mb-2.5 flex max-w-full flex-wrap gap-2">
            <Skeleton className="h-10 w-[18.75rem]" />
            <Skeleton className="h-10 w-[18.75rem]" />
          </div>
          <Skeleton className="h-[25rem] w-full" />
        </div>
      )}
      {userRecordsFetchStatus === "success" && tableName.length !== 0 && (
        <DataTable />
      )}
    </div>
  );
}

export default Databases;
