import { create } from "zustand";

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

const initProps: {
  userData: { [key: string]: string }[];
  userDataFiltered: { [key: string]: string }[];
  userKeys: string[];
} = {
  userData: [],
  userDataFiltered: [],
  userKeys: [],
};

const userDataStore = create<UserDataProps & UserDataActions>((set) => ({
  props: initProps,
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
    resetUserDataStore: () => set({ props: initProps }),
  },
}));

export default userDataStore;
