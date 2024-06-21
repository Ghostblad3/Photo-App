import { create } from "zustand";

interface UpdateUserInfoStoreProps {
  updateUserInfoStoreShowDialog: boolean;
  userId: string;
  userIndex: string;
  tableName: string;
}

interface UpdateUserInfoStore {
  updateUserInfoStoreProps: UpdateUserInfoStoreProps;
  setUpdateUserInfoStoreProps: (value: UpdateUserInfoStoreProps) => void;
  setUpdateUserInfoShowDialog: (value: boolean) => void;
  resetUpdateUserInfoStore: () => void;
}

const initialState: UpdateUserInfoStoreProps = {
  updateUserInfoStoreShowDialog: false,
  userId: "",
  userIndex: "",
  tableName: "",
};

const updateUserInfoStore = create<UpdateUserInfoStore>((set) => ({
  updateUserInfoStoreProps: initialState,
  setUpdateUserInfoStoreProps: (value) =>
    set({ updateUserInfoStoreProps: value }),
  setUpdateUserInfoShowDialog: (value) =>
    set((state) => ({
      updateUserInfoStoreProps: {
        ...state.updateUserInfoStoreProps,
        updateUserInfoStoreShowDialog: value,
      },
    })),
  resetUpdateUserInfoStore: () =>
    set({ updateUserInfoStoreProps: initialState }),
}));

export default updateUserInfoStore;
