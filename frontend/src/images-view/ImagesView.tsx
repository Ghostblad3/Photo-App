import TableNamesCombobox from "./TableNamesCombobox";
import Grid from "./Grid";
import selectedTableInfoStore from "./stores/selectedTableInfoStore";

function ImagesView() {
  const selectedTableInfo = selectedTableInfoStore(
    (state) => state.selectedTableInfo
  );

  return (
    <>
      <TableNamesCombobox />
      {selectedTableInfo.tableName !== "" ? <Grid /> : null}
    </>
  );
}

export default ImagesView;
