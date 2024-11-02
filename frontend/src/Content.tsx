import { lazy, Suspense } from "react";
import Databases from "./databases-view/Databases";
import Alerts from "./Alerts";
const ImagesView = lazy(() => import("./images-view/ImagesView"));
const CreateDbRecordsView = lazy(
  () => import("./create-db-records-view/CreateDbRecordsView")
);
const DeleteTableView = lazy(
  () => import("./remove-table-view/DeleteTableView")
);

function Content({ currentComponent }: { currentComponent: number }) {
  return (
    <div className="w-[calc(100%-250px)]">
      <div className="h-full w-full p-2.5 bg-white overflow-y-auto">
        {currentComponent === 0 && <Databases />}
        {currentComponent === 1 && (
          <Suspense fallback={<></>}>
            <CreateDbRecordsView />
          </Suspense>
        )}
        {currentComponent === 2 && (
          <Suspense fallback={<></>}>
            <DeleteTableView />
          </Suspense>
        )}
        {currentComponent === 3 && (
          <Suspense fallback={<></>}>
            <ImagesView />
          </Suspense>
        )}
      </div>
      <Alerts />
    </div>
  );
}

export default Content;
