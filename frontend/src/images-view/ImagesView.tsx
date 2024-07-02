import TableNamesCombobox from "./TableNamesCombobox";
import Grid from "./Grid";
import MultiAlertComponent from "../global-components/MultiAlertComponet";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";
import operationStore from "../global-stores/operationStore";

function ImagesView() {
  const { selectedTableInfo } = selectedTableInfoStore();
  const { showQueue } = operationStore();

  return (
    <>
      <TableNamesCombobox />
      {selectedTableInfo.tableName !== "" ? <Grid /> : null}
      <div className="fixed bottom-4 right-4 z-50">
        {showQueue.map((item) => (
          <div key={item.hash}>
            <MultiAlertComponent item={item} />
          </div>
        ))}
      </div>
    </>
  );
}

export default ImagesView;
