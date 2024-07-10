import TableNamesCombobox from "./TableNamesCombobox";
import Grid from "./Grid";
import selectedTableStore from "./stores/selectedTableStore";

function ImagesView() {
  const tableName = selectedTableStore((state) => state.props.tableName);
  return (
    <>
      <TableNamesCombobox />
      {tableName !== "" && <Grid />}
    </>
  );
}

export default ImagesView;
