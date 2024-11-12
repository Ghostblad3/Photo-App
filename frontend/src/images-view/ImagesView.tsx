import TableNamesCombobox from "./TableNamesCombobox";
import Grid from "./Grid";
import useSelectedTableStore from "./stores/selectedTableStore";

function ImagesView() {
  const tableName = useSelectedTableStore((state) => state.props.tableName);
  return (
    <>
      <TableNamesCombobox />
      {tableName !== "" && <Grid />}
    </>
  );
}

export default ImagesView;
