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

const initialState = {
  tableName: "",
  columnNames: [],
  userNumber: "",
  screenshotNumber: "",
  screenshotAverageSize: "",
};

const selectedTableInfoStore = create<
  SelectTableInfoProps & SelectedTableInfoActions
>((set) => ({
  props: initialState,
  actions: {
    setTableName: (value: string) =>
      set((state) => ({
        props: {
          ...state.props,
          tableName: value,
        },
      })),
    setColumnNames: (value: string[]) =>
      set((state) => ({
        props: {
          ...state.props,
          columnNames: value,
        },
      })),
    setUserNumber: (value: string) =>
      set((state) => ({
        props: {
          ...state.props,
          userNumber: value,
        },
      })),
    setScreenshotNumber: (value: string) =>
      set((state) => ({
        props: {
          ...state.props,
          screenshotNumber: value,
        },
      })),
    setScreenshotAverageSize: (value: string) =>
      set((state) => ({
        props: {
          ...state.props,
          screenshotAverageSize: value,
        },
      })),
    resetSelectedTableInfoStore: () => set(() => ({ props: initialState })),
  },
}));

export default selectedTableInfoStore;
