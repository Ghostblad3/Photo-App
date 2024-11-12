import { create } from "zustand";

interface DeleteUserProps {
  props: {
    showDialog: boolean;
    userId: string;
    userIdName: string;
    tableName: string;
  };
}

interface DeleteUserActions {
  actions: {
    setProps: (userId: string, userIdName: string, tableName: string) => void;
    setShowDialog: (showDialog: boolean) => void;
    resetDeleteUserStore: () => void;
  };
}

const initialProps: DeleteUserProps["props"] = {
  showDialog: false,
  userId: "",
  userIdName: "",
  tableName: "",
};

const useDeleteUserStore = create<DeleteUserProps & DeleteUserActions>(
  (set) => ({
    props: initialProps,
    actions: {
      setProps: (userId: string, userIdName: string, tableName: string) => {
        set({
          props: {
            showDialog: true,
            userId,
            userIdName,
            tableName,
          },
        });
      },
      setShowDialog: (showDialog: boolean) => {
        set({
          props: {
            ...initialProps,
            showDialog,
          },
        });
      },
      resetDeleteUserStore: () => {
        set({
          props: initialProps,
        });
      },
    },
  })
);

export default useDeleteUserStore;
