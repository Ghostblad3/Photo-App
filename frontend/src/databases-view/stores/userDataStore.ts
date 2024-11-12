import { create } from "zustand";

interface UserDataProps {
  props: {
    userData: { [key: string]: string }[];
    filteredUserData: { [key: string]: string }[];
    userKeys: string[];
  };
}

interface UserDataActions {
  actions: {
    setUserData: (userData: { [key: string]: string }[]) => void;
    setUserKeys: (userKeys: string[]) => void;
    setFilteredUserData: (
      filteredUserData: { [key: string]: string }[]
    ) => void;
    addUser: (user: { [key: string]: string }) => void;
    updateUser: (oldUserId: string, user: { [key: string]: string }) => void;
    deleteUser: (key: string, id: string) => void;
    deleteUserScreenshot: (key: string, id: string) => void;
    resetUserData: () => void;
  };
}

const initProps: {
  userData: { [key: string]: string }[];
  filteredUserData: { [key: string]: string }[];
  userKeys: string[];
} = {
  userData: [],
  filteredUserData: [],
  userKeys: [],
};

const useUserDataStore = create<UserDataProps & UserDataActions>((set) => ({
  props: initProps,
  actions: {
    setUserData: (userData: { [key: string]: string }[]) =>
      set((state) => ({
        props: { ...state.props, userData, filteredUserData: userData },
      })),
    setFilteredUserData: (filteredUserData: { [key: string]: string }[]) =>
      set((state) => ({ props: { ...state.props, filteredUserData } })),
    setUserKeys: (userKeys: string[]) =>
      set((state) => ({ props: { ...state.props, userKeys } })),
    addUser: (user: { [key: string]: string }) =>
      set((state) => ({
        props: { ...state.props, userData: [...state.props.userData, user] },
      })),
    updateUser: (oldUserId, user: { [key: string]: string }) =>
      set((state) => ({
        props: {
          ...state.props,
          userData: state.props.userData.map((u) =>
            u[state.props.userKeys[0]] === oldUserId ? { ...u, ...user } : u
          ),
        },
      })),
    deleteUser: (key: string, id: string) =>
      set((state) => ({
        props: {
          ...state.props,
          userData: state.props.userData.filter((u) => u[key] !== id),
        },
      })),
    deleteUserScreenshot: (key: string, id: string) =>
      set((state) => ({
        props: {
          ...state.props,
          userData: state.props.userData.map((user) => {
            if (user[key] === id) {
              return {
                ...user,
                has_screenshot: "no",
                screenshot_day: "-",
                photo_timestamp: "-",
              };
            }

            return user;
          }),
        },
      })),
    resetUserData: () => set(() => ({ props: initProps })),
  },
}));

export default useUserDataStore;
