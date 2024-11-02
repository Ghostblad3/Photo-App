import { create } from "zustand";

interface ScreenshotProps {
  props: {
    showDialog: boolean;
    userInfo: { [key: string]: string };
    tableName: string;
    keyName: string;
  };
}

interface ScreenshotActions {
  actions: {
    setShowDialog: (showDialog: boolean) => void;
    setUserInfo: (userInfo: { [key: string]: string }) => void;
    setTableName: (tableName: string) => void;
    setKeyName: (keyName: string) => void;
    resetScreenshotStore(): void;
  };
}

const initialProps = {
  showDialog: false,
  userInfo: {},
  tableName: "",
  keyName: "",
};

const screenshotStore = create<ScreenshotProps & ScreenshotActions>((set) => ({
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
    resetScreenshotStore: () => {
      set(() => ({ props: initialProps }));
    },
  },
}));

export default screenshotStore;
