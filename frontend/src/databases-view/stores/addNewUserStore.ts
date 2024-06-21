import { create } from "zustand";

interface AddNewUserStoreProps {
  addNewUserShowDialog: boolean;
  tableName: string;
}

interface AddNewUserStore {
  addNewUserStoreProps: AddNewUserStoreProps;
  setAddNewUserStoreProps: (value: AddNewUserStoreProps) => void;
  setAddNewUserShowDialog: (value: boolean) => void;
  resetAddNewUserStore: () => void;
}

const initialProps: AddNewUserStoreProps = {
  addNewUserShowDialog: false,
  tableName: "",
};

const addNewUserStore = create<AddNewUserStore>((set) => ({
  addNewUserStoreProps: initialProps,
  setAddNewUserStoreProps: (value: AddNewUserStoreProps) =>
    set(() => ({ addNewUserStoreProps: value })),
  setAddNewUserShowDialog: (value: boolean) =>
    set((state) => ({
      addNewUserStoreProps: {
        ...state.addNewUserStoreProps,
        addNewUserShowDialog: value,
      },
    })),
  resetAddNewUserStore: () =>
    set(() => ({
      addNewUserStoreProps: initialProps,
    })),
}));

export default addNewUserStore;
