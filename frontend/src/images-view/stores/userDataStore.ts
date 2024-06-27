import { create } from "zustand";

type UserData = {
  [key: string]: string;
};

interface UserDataStore {
  userData: UserData[];
  userDataFiltered: UserData[];
  userKeys: string[];
  fetching: boolean;
  setUserData: (data: UserData[]) => void;
  setUserDataFiltered: (data: UserData[]) => void;
  setFetching: (value: boolean) => void;
  resetUserData: () => void;
}

const userDataStore = create<UserDataStore>((set) => ({
  userData: [],
  userDataFiltered: [],
  userKeys: [],
  fetching: false,
  setUserData: (data: UserData[]) =>
    set({
      userData: data,
      userDataFiltered: data,
      userKeys: Object.keys(data[0]),
    }),
  setUserDataFiltered: (data: UserData[]) => set({ userDataFiltered: data }),
  setFetching: (value: boolean) => set({ fetching: value }),
  resetUserData: () =>
    set({ userData: [], userDataFiltered: [], userKeys: [], fetching: false }),
}));

export default userDataStore;
