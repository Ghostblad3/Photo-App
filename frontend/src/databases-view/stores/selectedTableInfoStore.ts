import { create } from "zustand";

interface SelectTableInfoProps {
  props: {
    tableName: string;
    columnNames: string[];
    userNumber: string;
    screenshotNumber: string;
    screenshotAverageSize: string;
  };
}

interface SelectedTableInfoActions {
  actions: {
    setTableName: (tableName: string) => void;
    setColumnNames: (columnNames: string[]) => void;
    setUserNumber: (userNumber: string) => void;
    setScreenshotNumber: (screenshotNumber: string) => void;
    setScreenshotAverageSize: (screenshotAverageSize: string) => void;
    resetSelectedTableInfoStore: () => void;
  };
}

const initialProps = {
  tableName: "",
  columnNames: [],
  userNumber: "",
  screenshotNumber: "",
  screenshotAverageSize: "",
};

const selectedTableInfoStore = create<
  SelectTableInfoProps & SelectedTableInfoActions
>((set) => ({
  props: initialProps,
  actions: {
    setTableName: (tableName: string) =>
      set((state) => ({
        props: {
          ...state.props,
          tableName,
        },
      })),
    setColumnNames: (columnNames: string[]) =>
      set((state) => ({
        props: {
          ...state.props,
          columnNames,
        },
      })),
    setUserNumber: (userNumber: string) =>
      set((state) => ({
        props: {
          ...state.props,
          userNumber,
        },
      })),
    setScreenshotNumber: (screenshotNumber: string) =>
      set((state) => ({
        props: {
          ...state.props,
          screenshotNumber,
        },
      })),
    setScreenshotAverageSize: (screenshotAverageSize: string) =>
      set((state) => ({
        props: {
          ...state.props,
          screenshotAverageSize,
        },
      })),
    resetSelectedTableInfoStore: () => set(() => ({ props: initialProps })),
  },
}));

export default selectedTableInfoStore;
