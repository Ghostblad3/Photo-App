import { create } from "zustand";

interface ScreenshotAsBase64Props {
  displayDialog: boolean;
  userInfo: { [key: string]: string };
  tableName: string;
  keyName: string;
  screenshot: string;
}

interface ScreenshotAsBase64 {
  screenshotAsBase64Props: ScreenshotAsBase64Props;
  setDisplayDialog: (value: boolean) => void;
  setParams: (
    userInfo: { [key: string]: string },
    tableName: string,
    keyName: string
  ) => void;
  setScreenshot: (screenshot: string) => void;
  resetScreenshotAsBase64Store(): void;
}

const initialProps: ScreenshotAsBase64Props = {
  displayDialog: false,
  userInfo: {},
  tableName: "",
  keyName: "",
  screenshot: "",
};

const screenshotAsBase64Store = create<ScreenshotAsBase64>((set) => ({
  screenshotAsBase64Props: initialProps,
  setDisplayDialog: (value: boolean) =>
    set((state) => ({
      screenshotAsBase64Props: {
        ...state.screenshotAsBase64Props,
        displayDialog: value,
      },
    })),
  setParams: (
    userInfo: { [key: string]: string },
    tableName: string,
    keyName: string
  ) =>
    set((state) => ({
      screenshotAsBase64Props: {
        ...state.screenshotAsBase64Props,
        userInfo: userInfo,
        tableName: tableName,
        keyName: keyName,
      },
    })),
  setScreenshot: (screenshot: string) =>
    set((state) => ({
      screenshotAsBase64Props: {
        ...state.screenshotAsBase64Props,
        screenshot: screenshot,
      },
    })),
  resetScreenshotAsBase64Store: () =>
    set(() => ({ screenshotAsBase64Props: initialProps })),
}));

export default screenshotAsBase64Store;
