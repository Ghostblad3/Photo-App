import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "./VirtualizedNew";
import { Skeleton } from "@/components/ui/skeleton";
import TableNamesCombobox from "./TableNamesCombobox";
import Cards from "./Cards";
import userDataStore from "./stores/userDataStore";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import searchStore from "./stores/searchStore";
import operationStore from "../global-stores/operationStore";

function Databases() {
  const tableName = selectedTableInfoStore((state) => state.props.tableName);
  const {
    setColumnNames,
    setUserNumber,
    setScreenshotNumber,
    setScreenshotAverageSize,
    resetSelectedTableInfoStore,
  } = selectedTableInfoStore((state) => state.actions);
  const { setUserData, setUserKeys, resetUserData } = userDataStore(
    (state) => state.actions
  );
  const resetSearchStore = searchStore(
    (state) => state.actions.resetSearchStore
  );
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

  const fetchersHashRef = useRef(crypto.randomUUID());
  const userRecordsHashRef = useRef(crypto.randomUUID());

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
      addOperation(
        fetchersHashRef.current,
        "pending",
        "fetch",
        "Fetching the selected table information.",
        false
      );

      setTableInfoFetchStatus("pending");

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
              `http://localhost:3000/table/table-column-names/{"tableName":"${tableName}"}`
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
              `http://localhost:3000/table/count-records/{"tableName":"${tableName}"}`
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
              `http://localhost:3000/table/count-screenshots/{"tableName":"${tableName}"}`
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
              `http://localhost:3000/table/screenshots-size/{"tableName":"${tableName}"}`
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
          fetchersHashRef.current,
          "error",
          "Failed to fetch the selected table information"
        );
        remove(fetchersHashRef.current);
        setTableInfoFetchStatus("error");

        return {};
      }

      changeOperationStatus(
        fetchersHashRef.current,
        "success",
        "Successfully fetched the selected table information"
      );
      remove(fetchersHashRef.current);

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
      addOperation(
        userRecordsHashRef.current,
        "pending",
        "fetch",
        "Fetching user records",
        false
      );

      const time = Date.now();

      let response = await fetch(
        `http://localhost:3000/record/get-user-data/{"tableName":"${tableName}"}`,
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
          userRecordsHashRef.current,
          "error",
          "Failed to fetch user records"
        );
        remove(userRecordsHashRef.current);
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
        `http://localhost:3000/screenshot/retrieve-user-data-with-screenshots/{"tableName":"${tableName}"}`,
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
          userRecordsHashRef.current,
          "error",
          "Failed to fetch user records"
        );
        remove(userRecordsHashRef.current);
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
        userRecordsHashRef.current,
        "success",
        "Successfully fetched user records"
      );
      remove(userRecordsHashRef.current);
      setUserRecordsFetchStatus("success");

      setUserKeys(keys);
      setUserData(userDataUpdated);

      return {};
    },
    enabled: false,
  });
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function throttle(this: any, mainFunction: () => void, delay: number) {
    let allow: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any) => {
      if (allow === false) {
        mainFunction.apply(this, args);
        allow = true;
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
    <div className="flex flex-col min-h-full">
      <TableNamesCombobox />

      {tableInfoFetchStatus === "pending" ? (
        <>
          <div className="my-2 pl-2.5 flex items-center gap-2.5">
            <Skeleton className="rounded-lg h-6 w-[2.75rem] shadow-lg" />
            <Skeleton className="h-[0.875rem] w-[9.25rem] shadow-lg" />
          </div>
          <div className="grid lg:grid-cols-4 gap-5 auto-rows-fr p-2.5">
            <Skeleton className="rounded-lg h-[6.875rem] shadow-lg" />
            <Skeleton className="rounded-lg h-[6.875rem] shadow-lg" />
            <Skeleton className="rounded-lg h-[6.875rem] shadow-lg" />
            <Skeleton className="rounded-lg h-[6.875rem] shadow-lg" />
          </div>
        </>
      ) : null}

      {tableInfoFetchStatus === "success" && tableName.length !== 0 ? (
        <Cards />
      ) : null}

      {tableInfoFetchStatus === "success" && tableName.length !== 0 ? (
        <Button className="m-2" onClick={() => throttledOperation()}>
          Show records
        </Button>
      ) : null}

      {userRecordsFetchStatus === "pending" ? (
        <div className="h-full mx-2.5">
          <div className="flex gap-2 mb-2.5 ">
            <Skeleton className="h-10 w-[12.5rem]" />
            <Skeleton className="h-10 w-[12.5rem]" />
          </div>
          <Skeleton className="h-[25rem] w-full" />
        </div>
      ) : null}

      {userRecordsFetchStatus === "success" && tableName.length !== 0 ? (
        <DataTable />
      ) : null}
    </div>
  );
}

export default Databases;
