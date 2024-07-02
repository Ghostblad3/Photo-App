import { create } from "zustand";

interface AddNewScreenshotState {
  props: {
    showDialog: boolean;
    tableName: string;
    userIdName: string;
    userId: string;
    screenshotAsBase64: string;
  };
}

interface AddNewScreenshotActions {
  actions: {
    setTableName: (value: string) => void;
    setUserIdName: (value: string) => void;
    setUserId: (value: string) => void;
    setScreenshotAsBase64: (value: string) => void;
    setShowDialog: (value: boolean) => void;
    resetAddNewScreenshotStore: () => void;
  };
}

const initialProps = {
  showDialog: false,
  tableName: "",
  userIdName: "",
  userId: "",
  screenshotAsBase64: "",
};

const addNewScreesnotStore = create<
  AddNewScreenshotState & AddNewScreenshotActions
>((set) => ({
  props: initialProps,
  actions: {
    setTableName: (value: string) =>
      set((state) => ({
        props: { ...state.props, tableName: value },
      })),
    setUserIdName: (value: string) =>
      set((state) => ({
        props: { ...state.props, userIdName: value },
      })),
    setUserId: (value: string) =>
      set((state) => ({
        props: { ...state.props, userId: value },
      })),
    setScreenshotAsBase64: (value: string) =>
      set((state) => ({
        props: { ...state.props, screenshotAsBase64: value },
      })),
    setShowDialog: (value: boolean) =>
      set((state) => ({
        props: { ...state.props, showDialog: value },
      })),
    resetAddNewScreenshotStore: () =>
      set(() => ({
        props: initialProps,
      })),
  },
}));

export default addNewScreesnotStore;
