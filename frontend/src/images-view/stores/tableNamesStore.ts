import { create } from "zustand";

interface TableNames {
  tableNames: string[];
  setTableNames: (tableNames: string[]) => void;
  resetTableNames: () => void;
}

const tableNamesStore = create<TableNames>((set) => ({
  tableNames: [],
  setTableNames: (tableNames: string[]) =>
    set(() => ({ tableNames: tableNames })),
  resetTableNames: () => set(() => ({ tableNames: [] })),
}));

export default tableNamesStore;
