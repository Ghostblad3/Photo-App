import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "./DatatableVirtualized";
import { Skeleton } from "@/components/ui/skeleton";
import TableNamesCombobox from "./TableNamesCombobox";
import Cards from "./Cards";
import userDataStore from "./stores/userDataStore";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import searchStore from "./stores/searchStore";

function Databases() {
  const {
    selectedTableInfo,
    setSelectedTableInfo,
    resetSelectedTableInfoStore,
  } = selectedTableInfoStore((state) => ({
    selectedTableInfo: state.selectedTableInfo,
    setSelectedTableInfo: state.setSelectedTableInfo,
    resetSelectedTableInfoStore: state.resetSelectedTableInfoStore,
  }));

  const { userData, setUserData, setUserKeys, resetUserData } = userDataStore(
    (state) => ({
      userData: state.userData,
      userKeys: state.userKeys,
      setUserData: state.setUserData,
      setUserKeys: state.setUserKeys,
      resetUserData: state.resetUserData,
    })
  );

  const resetSearch = searchStore((state) => state.resetSearch);

  useEffect(() => {
    return () => {
      resetSelectedTableInfoStore();
      resetUserData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ["table-info", selectedTableInfo.tableName],
    queryFn: async () => {
      const fetches: Promise<
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

      try {
        const results = await Promise.all(fetches);
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
          return {};
        }

        setSelectedTableInfo({
          ...selectedTableInfo,
          columnNames: tableColumnNamesResult.data as string[],
          userNumber: (countRecordsResult.data as number).toString(),
          screenshotNumber: (countScreenshotsResult.data as number).toString(),
          screenshotAverageSize: (
            averageScreenshotSizeResult.data as number
          ).toString(),
        });
      } catch (e) {
        throw new Error("Something went wrong");
      }

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
    let response;
    let receivedObject: {
      status: string;
      data: unknown;
      error: { message: string };
    } = { status: "", data: [], error: { message: "" } };

    try {
      response = await fetch(url, {
        cache: "no-store",
      });

      if (!response.ok) return "error";

      receivedObject = await response.json();

      const { status } = receivedObject;

      if (status === "error") return "error";
    } catch (e) {
      return "error";
    }

    return receivedObject;
  }

  const { refetch: fetchTableRecords, isFetching } = useQuery({
    queryKey: ["tableRecords", selectedTableInfo.tableName],
    queryFn: async () => {
      let response = await fetch(
        `http://localhost:3000/record/get-user-data/{"tableName":"${selectedTableInfo.tableName}"}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        resetUserData();
        return {};
      }

      let receivedObject: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await response.json();

      const { status, data } = receivedObject;

      if (status === "error") {
        resetUserData();
        return {};
      }

      response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-data-with-screenshots/{"tableName":"${selectedTableInfo.tableName}"}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        resetUserData();
        return {};
      }

      receivedObject = await response.json();

      const { status: secondRequestStatus, data: secondRequestData } =
        receivedObject;

      if (secondRequestStatus === "error") {
        resetUserData();
        return {};
      }

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

      setUserKeys(keys);
      setUserData(userDataUpdated);

      return {};
    },
    enabled: false,
  });

  return (
    <div className="flex flex-col min-h-full">
      <TableNamesCombobox />

      {selectedTableInfo.tableName !== "" ? <Cards /> : null}
      {selectedTableInfo.tableName !== "" ? (
        <Button className="m-2" onClick={() => fetchTableRecords()}>
          Show records
        </Button>
      ) : null}

      {isFetching && userData.length === 0 ? (
        <div className="h-full mx-2.5">
          <div className="flex gap-2 mb-2.5 ">
            <Skeleton className="h-[40px] w-[200px]" />
            <Skeleton className="h-[40px] w-[200px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : null}

      {selectedTableInfo.tableName !== "" && userData.length !== 0 ? (
        <DataTable />
      ) : null}
    </div>
  );
}

export default Databases;
