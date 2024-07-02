import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
// import { DataTable } from "./DatatableVirtualized";
import { DataTable } from "./VirtualizedNew";
import { Skeleton } from "@/components/ui/skeleton";
import MultiAlertComponent from "../global-components/MultiAlertComponet";
import TableNamesCombobox from "./TableNamesCombobox";
import Cards from "./Cards";
import userDataStore from "./stores/userDataStore";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import searchStore from "./stores/searchStore";
import operationStore from "../global-stores/operationStore";

function Databases() {
  const {
    selectedTableInfo,
    setSelectedTableInfo,
    resetSelectedTableInfoStore,
  } = selectedTableInfoStore();
  const { setUserData, setUserKeys, resetUserData } = userDataStore();
  const { resetSearch } = searchStore();
  const { showQueue, addOperation, changeOperationStatus, removeOperation } =
    operationStore();

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
  }, [selectedTableInfo.tableName]);

  useQuery({
    queryKey: ["table-info", selectedTableInfo.tableName],
    queryFn: async () => {
      addOperation(
        fetchersHashRef.current,
        "pending",
        "fetch",
        "Fetching selected table information",
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
              `http://localhost:3000/table/table-column-names/{"tableName":"${selectedTableInfo.tableName}"}`
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
              `http://localhost:3000/table/count-records/{"tableName":"${selectedTableInfo.tableName}"}`
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
              `http://localhost:3000/table/count-screenshots/{"tableName":"${selectedTableInfo.tableName}"}`
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
              `http://localhost:3000/table/screenshots-size/{"tableName":"${selectedTableInfo.tableName}"}`
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
          "Fetching the selected table info failed"
        );
        remove(fetchersHashRef.current);
        setTableInfoFetchStatus("error");

        return {};
      }

      changeOperationStatus(
        fetchersHashRef.current,
        "success",
        "Selected table info fetch succeeded"
      );
      remove(fetchersHashRef.current);

      setSelectedTableInfo({
        ...selectedTableInfo,
        columnNames: tableColumnNamesResult.data as string[],
        userNumber: (countRecordsResult.data as number).toString(),
        screenshotNumber: (countScreenshotsResult.data as number).toString(),
        screenshotAverageSize: (
          averageScreenshotSizeResult.data as number
        ).toString(),
      });
      setTableInfoFetchStatus("success");

      return {};
    },
    enabled: selectedTableInfo.tableName !== "",
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
    queryKey: ["tableRecords", selectedTableInfo.tableName],
    queryFn: async () => {
      addOperation(
        userRecordsHashRef.current,
        "pending",
        "fetch",
        "Fetching user records",
        false
      );

      let response = await fetch(
        `http://localhost:3000/record/get-user-data/{"tableName":"${selectedTableInfo.tableName}"}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        changeOperationStatus(
          userRecordsHashRef.current,
          "error",
          "Fetching user records failed"
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
        `http://localhost:3000/screenshot/retrieve-user-data-with-screenshots/{"tableName":"${selectedTableInfo.tableName}"}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        changeOperationStatus(
          userRecordsHashRef.current,
          "error",
          "Fetching user records failed"
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

      resetSearch();
      resetUserData();

      changeOperationStatus(
        userRecordsHashRef.current,
        "success",
        "User records fetch succeeded"
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
            <Skeleton className="rounded-lg h-[24px] w-[44px] shadow-lg" />
            <Skeleton className="h-[14px] w-[148px] shadow-lg" />
          </div>
          <div className="grid lg:grid-cols-4 gap-5 auto-rows-fr p-2.5">
            <Skeleton className="rounded-lg h-[110px] shadow-lg" />
            <Skeleton className="rounded-lg h-[110px] shadow-lg" />
            <Skeleton className="rounded-lg h-[110px] shadow-lg" />
            <Skeleton className="rounded-lg h-[110px] shadow-lg" />
          </div>
        </>
      ) : null}

      {tableInfoFetchStatus === "success" &&
      selectedTableInfo.tableName.length !== 0 ? (
        <Cards />
      ) : null}

      {tableInfoFetchStatus === "success" &&
      selectedTableInfo.tableName.length !== 0 ? (
        <Button className="m-2" onClick={() => throttledOperation()}>
          Show records
        </Button>
      ) : null}

      {userRecordsFetchStatus === "pending" ? (
        <div className="h-full mx-2.5">
          <div className="flex gap-2 mb-2.5 ">
            <Skeleton className="h-[40px] w-[200px]" />
            <Skeleton className="h-[40px] w-[200px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : null}

      {userRecordsFetchStatus === "success" &&
      selectedTableInfo.tableName.length !== 0 ? (
        <DataTable />
      ) : null}

      <div className="fixed bottom-4 right-4 z-50">
        {showQueue.map((item) => (
          <div key={item.hash}>
            <MultiAlertComponent item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Databases;
