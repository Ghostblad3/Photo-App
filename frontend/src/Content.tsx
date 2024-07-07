import Databases from "./databases-view/Databases";
import ImagesView from "./images-view/ImagesView";
import CreateDbRecordsView from "./create-db-records-view/CreateDbRecordsView";
import DeleteTableView from "./remove-table-view/DeleteTableView";
import Alerts from "./Alerts";

function Content({ currentComponent }: { currentComponent: number }) {
  return (
    <>
      <div className="h-full w-full p-2.5 bg-white overflow-y-auto">
        {currentComponent === 0 ? <Databases /> : null}
        {currentComponent === 1 ? <CreateDbRecordsView /> : null}
        {currentComponent === 2 ? <DeleteTableView /> : null}
        {currentComponent === 3 ? <ImagesView /> : null}
      </div>
      <Alerts />
    </>
  );
}

export default Content;
