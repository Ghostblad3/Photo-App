import { create } from 'zustand';

interface TableNamesProps {
  tableNames: string[];
}

interface TableNamesActions {
  actions: {
    setTableNames: (tableNames: string[]) => void;
    resetTableNamesStore: () => void;
  };
}

const useTableNamesStore = create<TableNamesProps & TableNamesActions>(
  (set) => ({
    tableNames: [],
    actions: {
      setTableNames: (tableNames: string[]) => set(() => ({ tableNames })),
      resetTableNamesStore: () => set(() => ({ tableNames: [] })),
    },
  })
);

export { useTableNamesStore };
