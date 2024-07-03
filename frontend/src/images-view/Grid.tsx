import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ScreenshotDialog from "./ScreenshotDialog";
import SelectedKeysCombobox from "./SelectedKeysCombobox";
import SearchValueCombobox from "./SearchValueCombobox";
import SearchFieldCombobox from "./SearchFieldCombobox";
import selectedTableStore from "./stores/selectedTableStore";
import userDataStore from "./stores/userDataStore";
import singleUserStore from "./stores/singleUserStore";
import useAvailableKeysStore from "./stores/availableKeysStore";
import operationStore from "../global-stores/operationStore";

function Grid() {
  const selectedKeys = useAvailableKeysStore(
    (state) => state.props.selectedKeys
  );
  const { setAvailableKeys } = useAvailableKeysStore((state) => state.actions);
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
          "Failed to fetch user data"
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
          "Failed to fetch user data"
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
        "Successfully fetched user data"
      );
      remove(userDataFetchRef.current);

      if (data.length === 0) {
        resetUserDataStore();
        return {};
      }

      const [firstObject] = data;
      const keys = Object.keys(firstObject);

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
      {fetchUserDataStatus === "pending" ? (
        <>
          <div className="p-2.5">
            <Skeleton className="h-[40px] w-full" />
          </div>
          <div className="flex flex-wrap gap-2 mb-2.5">
            <div className="p-2.5 flex gap-2 w-[300px]">
              <div className="flex gap-2 mb-2.5 ">
                <Skeleton className="h-[40px] w-[200px]" />
              </div>
            </div>
            <div className="p-2.5 flex gap-2 w-[300px]">
              <div className="flex gap-2 mb-2.5 ">
                <Skeleton className="h-[40px] w-[200px]" />
              </div>
            </div>
          </div>
        </>
      ) : null}

      {fetchUserDataStatus === "success" ? (
        <>
          <SelectedKeysCombobox />
          <div className="flex flex-wrap gap-2 mb-2.5">
            <SearchValueCombobox />
            <SearchFieldCombobox />
          </div>
        </>
      ) : null}

      <div className="m-2.5 grid grid-repeat-auto-fill-min-max gap-10">
        {fetchUserDataStatus === "pending" ? (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <Fragment key={index}>
                <Skeleton className="h-[258px] bg-white rounded-lg flex flex-col p-2.5 shadow-custom">
                  <Skeleton className="h-[100px] w-[105px] mx-auto rounded-lg bg-slate-200">
                    <div className="w-full h-full rounded-lg flex justify-center items-center bg-slate-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        color={"#9b9b9b"}
                        fill={"none"}
                        className="m-auto"
                      >
                        <path
                          d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="16.5"
                          cy="7.5"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M16 22C15.3805 19.7749 13.9345 17.7821 11.8765 16.3342C9.65761 14.7729 6.87163 13.9466 4.01569 14.0027C3.67658 14.0019 3.33776 14.0127 3 14.0351"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 18C14.7015 16.6733 16.5345 15.9928 18.3862 16.0001C19.4362 15.999 20.4812 16.2216 21.5 16.6617"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Skeleton>
                  <Skeleton className="w-20 h-5 mt-4" />
                  <Skeleton className="w-28 h-5 mt-4" />
                </Skeleton>
              </Fragment>
            ))}
          </>
        ) : null}

        {fetchUserDataStatus === "success"
          ? userDataFiltered.map((item: { [key: string]: string }, index) => {
              // if (index > 10) return null;
              return (
                <ScreenshotDialog key={item[userKeys[0]]}>
                  <div
                    className="bg-white rounded-lg flex flex-col cursor-pointer"
                    onClick={() => {
                      setSingleUserData(userData[index]);
                    }}
                  >
                    <div className="w-full bg-slate-200 py-5 rounded-t-lg">
                      <img
                        className="h-[100px] w-[105px] mx-auto rounded-lg"
                        src={`data:image/png;base64,${item.screenshot}`}
                      />
                    </div>

                    {selectedKeys.map((key) => {
                      if (key === "screenshot") return null;

                      return (
                        <div
                          key={key}
                          className="flex flex-col px-1 mt-1.5 mb-0.5"
                        >
                          <Label className="font-semibold block text-sm cursor-pointer">
                            {key}
                          </Label>
                          <Label className="text-gray-700 dark:text-gray-300 text-base cursor-pointer">
                            {item[key]}
                          </Label>
                          <hr className="my-2" />
                        </div>
                      );
                    })}
                  </div>
                </ScreenshotDialog>
              );
            })
          : null}
      </div>
    </>
  );
}

export default Grid;
