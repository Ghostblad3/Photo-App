import { create } from 'zustand';

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

const initialProps: { tableNames: string[] } = {
  tableNames: [],
};

const useTableNamesStore = create<TableNamesProps & TableNamesActions>(
  (set) => ({
    props: initialProps,
    actions: {
      setTableNames: (tableNames: string[]) =>
        set(() => ({ props: { tableNames } })),
      resetTableNamesStore: () => set(() => ({ props: initialProps })),
    },
  })
);

export { useTableNamesStore };
