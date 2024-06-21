import { create } from "zustand";

interface DeleteUserScreenshotStoreProps {
  deleteUserScreenshotShowDialog: boolean;
  userId: string;
  userIdName: string;
  tableName: string;
}

interface DeleteUserScreenshotStore {
  deleteUserScreenshotStoreProps: DeleteUserScreenshotStoreProps;
  setDeleteUserScreenshotShowDialog: (value: boolean) => void;
  setDeleteUserScreenshotStoreProps: (
    value: DeleteUserScreenshotStoreProps
  ) => void;
  resetDeleteUserScreenshotStore: () => void;
}

const initialProps: DeleteUserScreenshotStoreProps = {
  deleteUserScreenshotShowDialog: false,
  userId: "",
  userIdName: "",
  tableName: "",
};

const deleteUserScreenshotStore = create<DeleteUserScreenshotStore>((set) => ({
  deleteUserScreenshotStoreProps: initialProps,
  setDeleteUserScreenshotShowDialog: (value: boolean) =>
    set((state) => ({
      deleteUserScreenshotStoreProps: {
        ...state.deleteUserScreenshotStoreProps,
        deleteUserScreenshotShowDialog: value,
      },
    })),
  setDeleteUserScreenshotStoreProps: (value: DeleteUserScreenshotStoreProps) =>
    set(() => ({ deleteUserScreenshotStoreProps: value })),
  resetDeleteUserScreenshotStore: () =>
    set(() => ({
      deleteUserScreenshotStoreProps: initialProps,
    })),
}));

export default deleteUserScreenshotStore;
