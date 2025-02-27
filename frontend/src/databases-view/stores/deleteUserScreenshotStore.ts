import { create } from 'zustand';

interface DeleteUserScreenshotProps {
  props: {
    showDialog: boolean;
    userId: string;
    userIdName: string;
    tableName: string;
  };
}

interface DeleteUserScreenshotActions {
  actions: {
    setShowDialog(showDialog: boolean): void;
    setUserId(userId: string): void;
    setUserIdName(userIdName: string): void;
    setTableName(tableName: string): void;
    resetDeleteUserScreenshotStore(): void;
  };
}

const initialProps = {
  showDialog: false,
  userId: '',
  userIdName: '',
  tableName: '',
};

const useDeleteUserScreenshotStore = create<
  DeleteUserScreenshotProps & DeleteUserScreenshotActions
>((set) => ({
  props: initialProps,
  actions: {
    setShowDialog(showDialog) {
      set((state) => ({
        props: {
          ...state.props,
          showDialog,
        },
      }));
    },
    setUserId(userId) {
      set((state) => ({
        props: {
          ...state.props,
          userId,
        },
      }));
    },
    setUserIdName(userIdName) {
      set((state) => ({
        props: {
          ...state.props,
          userIdName,
        },
      }));
    },
    setTableName(tableName) {
      set((state) => ({
        props: {
          ...state.props,
          tableName,
        },
      }));
    },
    resetDeleteUserScreenshotStore() {
      set(() => ({
        props: initialProps,
      }));
    },
  },
}));

export { useDeleteUserScreenshotStore };
