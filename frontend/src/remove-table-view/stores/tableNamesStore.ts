import { create } from 'zustand';

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

const initialProps: { tableNames: string[]; selectedTableName: string } = {
  tableNames: [],
  selectedTableName: '',
};

const useTableNamesStore = create<TableNamesProps & TableNamesActions>(
  (set) => ({
    props: initialProps,
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
            selectedTableName: '',
          },
        })),
      resetTableNamesStore: () => set(() => ({ props: initialProps })),
    },
  })
);

///

export { useTableNamesStore };
