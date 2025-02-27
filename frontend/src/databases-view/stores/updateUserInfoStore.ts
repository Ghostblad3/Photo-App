import { create } from 'zustand';

interface UpdateUserInfoProps {
  props: {
    showDialog: boolean;
    userId: string;
    userIndex: string;
    tableName: string;
  };
}

interface UpdateUserInfoActions {
  actions: {
    setShowDialog: (showDialog: boolean) => void;
    setUserId: (userId: string) => void;
    setUserIndex: (userIndex: string) => void;
    setTableName: (tableName: string) => void;
    resetUpdateUserInfoStore: () => void;
  };
}

const initialProps = {
  showDialog: false,
  userId: '',
  userIndex: '',
  tableName: '',
};

const useUpdateUserInfoStore = create<
  UpdateUserInfoProps & UpdateUserInfoActions
>((set) => ({
  props: initialProps,
  actions: {
    setShowDialog: (showDialog: boolean) =>
      set((state) => ({ props: { ...state.props, showDialog } })),
    setUserId: (userId: string) =>
      set((state) => ({ props: { ...state.props, userId } })),
    setUserIndex: (userIndex: string) =>
      set((state) => ({ props: { ...state.props, userIndex } })),
    setTableName: (tableName: string) =>
      set((state) => ({ props: { ...state.props, tableName } })),
    resetUpdateUserInfoStore: () => set(() => ({ props: initialProps })),
  },
}));

export { useUpdateUserInfoStore };
