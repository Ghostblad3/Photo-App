import { create } from "zustand";

type UserData = {
  [key: string]: string;
};

interface UserDataStore {
  userData: UserData[];
  userDataFiltered: UserData[];
  userKeys: string[];
  setUserData: (data: UserData[]) => void;
  setUserDataFiltered: (data: UserData[]) => void;
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
  resetUserData: () =>
    set({ userData: [], userDataFiltered: [], userKeys: [] }),
}));

export default userDataStore;
