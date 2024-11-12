import { create } from "zustand";

interface AddNewScreenshotProps {
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
    setTableName: (tableName: string) => void;
    setUserIdName: (userIdName: string) => void;
    setUserId: (userId: string) => void;
    setScreenshotAsBase64: (screenshotAsBase64: string) => void;
    setShowDialog: (showDialog: boolean) => void;
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

const useAddNewScreensotStore = create<
  AddNewScreenshotProps & AddNewScreenshotActions
>((set) => ({
  props: initialProps,
  actions: {
    setTableName: (tableName: string) =>
      set((state) => ({
        props: { ...state.props, tableName },
      })),
    setUserIdName: (userIdName: string) =>
      set((state) => ({
        props: { ...state.props, userIdName },
      })),
    setUserId: (userId: string) =>
      set((state) => ({
        props: { ...state.props, userId },
      })),
    setScreenshotAsBase64: (screenshotAsBase64: string) =>
      set((state) => ({
        props: { ...state.props, screenshotAsBase64 },
      })),
    setShowDialog: (showDialog: boolean) =>
      set((state) => ({
        props: { ...state.props, showDialog },
      })),
    resetAddNewScreenshotStore: () =>
      set(() => ({
        props: initialProps,
      })),
  },
}));

export default useAddNewScreensotStore;
