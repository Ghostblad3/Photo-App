import { create } from 'zustand';

interface UserDataProps {
  props: {
    userData: { [key: string]: string }[];
    userDataFiltered: { [key: string]: string }[];
    userKeys: string[];
  };
}

interface UserDataActions {
  actions: {
    setUserData: (userData: { [key: string]: string }[]) => void;
    setUserDataFiltered: (
      userDataFiltered: { [key: string]: string }[]
    ) => void;
    resetUserDataStore: () => void;
  };
}

const initialProps: {
  userData: { [key: string]: string }[];
  userDataFiltered: { [key: string]: string }[];
  userKeys: string[];
} = {
  userData: [],
  userDataFiltered: [],
  userKeys: [],
};

const useUserDataStore = create<UserDataProps & UserDataActions>((set) => ({
  props: initialProps,
  actions: {
    setUserData: (userData: { [key: string]: string }[]) =>
      set(() => ({
        props: {
          userData,
          userDataFiltered: userData,
          userKeys: Object.keys(userData[0]),
        },
      })),
    setUserDataFiltered: (userDataFiltered: { [key: string]: string }[]) =>
      set((state) => ({ props: { ...state.props, userDataFiltered } })),
    resetUserDataStore: () => set({ props: initialProps }),
  },
}));

export { useUserDataStore };
