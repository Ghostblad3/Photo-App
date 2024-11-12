import { create } from "zustand";

interface AddNewUserProps {
  props: {
    showDialog: boolean;
    tableName: string;
  };
}

interface AddNewUserActions {
  actions: {
    setShowDialog: (showDialog: boolean) => void;
    setTableName: (tableName: string) => void;
    resetAddNewUserStore: () => void;
  };
}

const initialProps = {
  showDialog: false,
  tableName: "",
};

const useAddNewUserStore = create<AddNewUserProps & AddNewUserActions>(
  (set) => ({
    props: initialProps,
    actions: {
      setShowDialog: (showDialog: boolean) =>
        set((state) => ({
          props: { ...state.props, showDialog },
        })),
      setTableName: (tableName: string) =>
        set((state) => ({
          props: { ...state.props, tableName },
        })),
      resetAddNewUserStore: () => set(() => ({ props: initialProps })),
    },
  })
);

export default useAddNewUserStore;
