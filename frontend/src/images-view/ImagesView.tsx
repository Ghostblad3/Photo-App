import TableNamesCombobox from "./TableNamesCombobox";
import Grid from "./Grid";
import MultiAlertComponent from "../global-components/MultiAlertComponet";
import selectedTableStore from "./stores/selectedTableStore";
import operationStore from "../global-stores/operationStore";

function ImagesView() {
  const tableName = selectedTableStore((state) => state.props.tableName);
  const showQueue = operationStore((state) => state.props.showQueue);

  return (
    <>
      <TableNamesCombobox />
      {tableName !== "" ? <Grid /> : null}
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
