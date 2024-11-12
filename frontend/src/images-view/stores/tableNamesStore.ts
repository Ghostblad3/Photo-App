import { create } from "zustand";

interface TableNamesProps {
  props: {
    tableNames: string[];
  };
}

interface TableNamesActions {
  actions: {
    setTableNames: (tableNames: string[]) => void;
    resetTableNamesStore: () => void;
  };
}

const initProps: { tableNames: string[] } = {
  tableNames: [],
};

const useTableNamesStore = create<TableNamesProps & TableNamesActions>(
  (set) => ({
    props: initProps,
    actions: {
      setTableNames: (tableNames: string[]) =>
        set(() => ({ props: { tableNames } })),
      resetTableNamesStore: () => set(() => ({ props: initProps })),
    },
  })
);

export default useTableNamesStore;
