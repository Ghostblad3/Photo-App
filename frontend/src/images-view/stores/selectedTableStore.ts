import { create } from "zustand";

interface SelectedTableProps {
  props: { tableName: string };
}

interface SelectedTableActions {
  actions: {
    setTableName: (tableName: string) => void;
    resetSelectedTableStore: () => void;
  };
}

const initialProps = {
  tableName: "",
};

const selectedTableStore = create<SelectedTableProps & SelectedTableActions>(
  (set) => ({
    props: initialProps,
    actions: {
      setTableName: (tableName) => set(() => ({ props: { tableName } })),
      resetSelectedTableStore: () => set(() => ({ props: initialProps })),
    },
  })
);

export default selectedTableStore;
