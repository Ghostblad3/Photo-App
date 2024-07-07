import { create } from "zustand";

interface TableNamesProps {
  props: {
    tableNames: string[];
    selectedTableName: string;
  };
}

interface TableNamesActions {
  actions: {
    setTableNames: (tableNames: string[]) => void;
    setSelectedTableName: (selectedTableName: string) => void;
    removeSelectedTable: () => void;
    resetTableNamesStore: () => void;
  };
}

const inialProps: { tableNames: string[]; selectedTableName: string } = {
  tableNames: [],
  selectedTableName: "",
};

const tableNamesStore = create<TableNamesProps & TableNamesActions>((set) => ({
  props: inialProps,
  actions: {
    setTableNames: (tableNames: string[]) =>
      set((state) => ({ props: { ...state.props, tableNames } })),
    setSelectedTableName: (selectedTableName: string) =>
      set((state) => ({ props: { ...state.props, selectedTableName } })),
    removeSelectedTable: () =>
      set((state) => ({
        props: {
          tableNames: state.props.tableNames.filter(
            (t) => t !== state.props.selectedTableName
          ),
          selectedTableName: "",
        },
      })),
    resetTableNamesStore: () => set(() => ({ props: inialProps })),
  },
}));

export default tableNamesStore;
