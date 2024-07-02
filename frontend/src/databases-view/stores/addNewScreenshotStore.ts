import { create } from "zustand";

interface AddNewScreenshotStoreProps {
  addNewScreenshotShowDialog: boolean;
  tableName: string;
  userIdName: string;
  userId: string;
  screenshotAsBase64: string;
}

interface AddNewScreenshotStore {
  addNewScreenshotStoreProps: AddNewScreenshotStoreProps;
  setAddNewScreenshotStoreProps: (value: AddNewScreenshotStoreProps) => void;
  setAddNewScreenshotShowDialog: (value: boolean) => void;
  resetAddNewScreenshotStore: () => void;
}

const initialProps: AddNewScreenshotStoreProps = {
  addNewScreenshotShowDialog: false,
  tableName: "",
  userIdName: "",
  userId: "",
  screenshotAsBase64: "",
};

const addNewUserStore = create<AddNewScreenshotStore>((set) => ({
  addNewScreenshotStoreProps: initialProps,
  setAddNewScreenshotStoreProps: (value: AddNewScreenshotStoreProps) =>
    set(() => ({
      addNewScreenshotStoreProps: value,
    })),
  setAddNewScreenshotShowDialog: (value: boolean) =>
    set((state) => ({
      addNewScreenshotStoreProps: {
        ...state.addNewScreenshotStoreProps,
        addNewScreenshotShowDialog: value,
      },
    })),
  resetAddNewScreenshotStore: () =>
    set(() => ({
      addNewScreenshotStoreProps: initialProps,
    })),
}));

export default addNewUserStore;
