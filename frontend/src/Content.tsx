import { DatabasesView } from './databases-view/DatabasesView';
import { Alerts } from './Alerts';
import { ImagesView } from './images-view/ImagesView';
import { CreateDbRecordsView } from './create-db-records-view/CreateDbRecordsView';
import { DeleteTableView } from './remove-table-view/DeleteTableView';

function Content({ currentComponent }: { currentComponent: number }) {
  return (
    <div className="size-full">
      <div className="h-full overflow-y-auto p-2.5">
        {currentComponent === 0 && <DatabasesView />}
        {currentComponent === 1 && <CreateDbRecordsView />}
        {currentComponent === 2 && <DeleteTableView />}
        {currentComponent === 3 && <ImagesView />}
      </div>
      <Alerts />
    </div>
  );
}

export { Content };
