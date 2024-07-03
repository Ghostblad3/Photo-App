import { create } from "zustand";

interface ScreenshotAsBase64Props {
  props: {
    showDialog: boolean;
    userInfo: { [key: string]: string };
    tableName: string;
    keyName: string;
    screenshotAsBase64: string;
  };
}

interface ScreenshotAsBase64Actions {
  actions: {
    setShowDialog: (showDialog: boolean) => void;
    setUserInfo: (userInfo: { [key: string]: string }) => void;
    setTableName: (tableName: string) => void;
    setKeyName: (keyName: string) => void;
    setScreenshotAsBase64: (screenshotAsBase64: string) => void;
    resetScreenshotAsBase64Store(): void;
  };
}

const initialProps = {
  showDialog: false,
  userInfo: {},
  tableName: "",
  keyName: "",
  screenshotAsBase64: "",
};

const screenshotAsBase64Store = create<
  ScreenshotAsBase64Props & ScreenshotAsBase64Actions
>((set) => ({
  props: initialProps,
  actions: {
    setShowDialog: (showDialog: boolean) => {
      set((state) => ({ props: { ...state.props, showDialog } }));
    },
    setUserInfo: (userInfo: { [key: string]: string }) => {
      set((state) => ({ props: { ...state.props, userInfo } }));
    },
    setTableName: (tableName: string) => {
      set((state) => ({ props: { ...state.props, tableName } }));
    },
    setKeyName: (keyName: string) => {
      set((state) => ({ props: { ...state.props, keyName } }));
    },
    setScreenshotAsBase64: (screenshotAsBase64: string) => {
      set((state) => ({ props: { ...state.props, screenshotAsBase64 } }));
    },
    resetScreenshotAsBase64Store: () => {
      set(() => ({ props: initialProps }));
    },
  },
}));

export default screenshotAsBase64Store;
