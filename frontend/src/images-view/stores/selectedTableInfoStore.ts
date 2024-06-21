import { create } from "zustand";

interface TableInfo {
  tableName: string;
}

interface SelectedTableInfo {
  selectedTableInfo: TableInfo;
  setSelectedTableInfo: (selectedTableInfo: TableInfo) => void;
  resetSelectedTableInfoStore: () => void;
}

const initialState: TableInfo = {
  tableName: "",
};

const selectedTableInfoStore = create<SelectedTableInfo>((set) => ({
  selectedTableInfo: initialState,
  setSelectedTableInfo: (selectedTableInfo: TableInfo) =>
    set(() => ({ selectedTableInfo: selectedTableInfo })),
  resetSelectedTableInfoStore: () =>
    set(() => ({ selectedTableInfo: initialState })),
}));

export default selectedTableInfoStore;
