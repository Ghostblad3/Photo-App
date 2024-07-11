import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "lucide-react";
import ScreenshotDialog from "./ScreenshotDialog";
import SelectedKeysCombobox from "./SelectedKeysCombobox";
import SearchValueCombobox from "./SearchValueCombobox";
import SearchFieldCombobox from "./SearchFieldCombobox";
import selectedTableStore from "./stores/selectedTableStore";
import userDataStore from "./stores/userDataStore";
import singleUserStore from "./stores/singleUserStore";
import availableKeysStore from "./stores/availableKeysStore";
import operationStore from "../global-stores/operationStore";

function Grid() {
  const selectedKeys = availableKeysStore((state) => state.props.selectedKeys);
  const { setAvailableKeys } = availableKeysStore((state) => state.actions);
  const tableName = selectedTableStore((state) => state.props.tableName);
  const userData = userDataStore((state) => state.props.userData);
  const userDataFiltered = userDataStore(
    (state) => state.props.userDataFiltered
  );
  const userKeys = userDataStore((state) => state.props.userKeys);
  const { setUserData, resetUserDataStore } = userDataStore(
    (state) => state.actions
  );
  const { setSingleUserData } = singleUserStore((state) => state.actions);
  const { addOperation, changeOperationStatus, removeOperation } =
    operationStore((state) => state.actions);

  const [count, setCount] = useState(0);
  const userDataFetchRef = useRef(crypto.randomUUID());
  const [fetchUserDataStatus, setFetchUserDataStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  useEffect(() => {
    return () => {
      resetUserDataStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useQuery({
    queryKey: ["user-data", tableName],
    queryFn: async () => {
      addOperation(
        userDataFetchRef.current,
        "pending",
        "fetch",
        "Fetching user data",
        true
      );

      const paramsObj = JSON.stringify({
        tableName,
      });

      const startTime = Date.now();

      const countResponse = await fetch(
        `http://localhost:3000/table/count-screenshots/${paramsObj}`,
        {
          cache: "no-store",
        }
      );

      if (!countResponse.ok) {
        changeOperationStatus(
          userDataFetchRef.current,
          "error",
          "Failed to fetch user data",
          true
        );
        remove(userDataFetchRef.current);
        setFetchUserDataStatus("error");

        resetUserDataStore();
        return {};
      }

      const countResult: {
        status: string;
        data: number;
        error: { message: string };
      } = await countResponse.json();

      const { data: countData } = countResult;

      setCount(countData);

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshots-all-days/${paramsObj}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        changeOperationStatus(
          userDataFetchRef.current,
          "error",
          "Failed to fetch user data",
          true
        );
        remove(userDataFetchRef.current);
        setFetchUserDataStatus("error");

        resetUserDataStore();
        return {};
      }

      const result: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = result;

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500)
        await new Promise((resolve) => setTimeout(resolve, 500 - timeTaken));

      changeOperationStatus(
        userDataFetchRef.current,
        "success",
        "Successfully fetched user data",
        false
      );
      remove(userDataFetchRef.current);

      if (data.length === 0) {
        resetUserDataStore();
        return {};
      }

      const [firstObject] = data;
      const keys = Object.keys(firstObject).filter(
        (key) => key !== "screenshot"
      );

      setUserData(data);
      setAvailableKeys(keys);
      setFetchUserDataStatus("success");

      return {};
    },
    enabled: tableName !== "",
  });

  async function remove(hash: string) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  if (fetchUserDataStatus === "error") {
    return (
      <div className="flex flex-shrink-0 m-2.5">
        <span className="mx-auto tx-xl">
          <Label className="text-xl">No data to display</Label>
        </span>
      </div>
    );
  }

  return (
    <>
      {fetchUserDataStatus === "pending" && (
        <>
          <div className="p-2.5">
            <Skeleton className="h-10 max-w-full" />
          </div>
          <div className="w-full flex flex-wrap gap-2 mb-2.5 p-2.5">
            <Skeleton className="h-10 w-full max-w-[17.5rem]" />
            <Skeleton className="h-10 w-full max-w-[17.5rem] ml-5" />
          </div>
        </>
      )}
      {fetchUserDataStatus === "success" && (
        <>
          <SelectedKeysCombobox />
          <div className="flex flex-wrap gap-2 mb-2.5">
            <SearchValueCombobox />
            <SearchFieldCombobox />
          </div>
        </>
      )}
      <div className="m-2.5 grid grid-repeat-auto-fill-min-max gap-10">
        {fetchUserDataStatus === "pending" && (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <Fragment key={index}>
                <Skeleton className="h-[16.125rem] bg-white rounded-lg flex flex-col p-2.5 shadow-custom">
                  <Skeleton className="h-[6.25rem] w-[6.563rem] mx-auto rounded-lg bg-slate-200">
                    <div className="h-full w-full rounded-lg flex justify-center items-center bg-slate-200">
                      <Image />
                    </div>
                  </Skeleton>
                  <Skeleton className="max-w-20 h-5 mt-4" />
                  <Skeleton className="max-w-28 h-5 mt-4" />
                </Skeleton>
              </Fragment>
            ))}
          </>
        )}
        {fetchUserDataStatus === "success" &&
          userDataFiltered.map((item: { [key: string]: string }) => {
            return (
              <ScreenshotDialog key={item[userKeys[0]]}>
                <div
                  key={item[userKeys[0]]}
                  className="bg-white rounded-lg flex flex-col cursor-pointer"
                  onClick={() => {
                    const key = userKeys[0];
                    const user = userData.find((u) => u[key] === item[key]);
                    if (user) {
                      setSingleUserData(user);
                    }
                  }}
                >
                  <div className="w-full bg-slate-200 py-5 rounded-t-lg">
                    <img
                      className="h-[6.25rem] w-[6.563rem] mx-auto rounded-lg"
                      src={`data:image/png;base64,${item.screenshot}`}
                    />
                  </div>
                  {selectedKeys.map((key) => {
                    return (
                      <div
                        key={key}
                        className="flex flex-col px-1 mt-1.5 mb-0.5"
                      >
                        <p className="font-semibold block text-sm cursor-pointer">
                          {key}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-base cursor-pointer">
                          {item[key]}
                        </p>
                        <hr className="my-2" />
                      </div>
                    );
                  })}
                </div>
              </ScreenshotDialog>
            );
          })}
      </div>
    </>
  );
}

export default Grid;
