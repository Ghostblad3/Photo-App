import { create } from "zustand";

interface UserData {
  userData: { [key: string]: string }[];
  userKeys: string[];
  setUserData: (userData: { [key: string]: string }[]) => void;
  setUserKeys: (userKeys: string[]) => void;
  addUser: (user: { [key: string]: string }) => void;
  updateUser: (oldUserId: string, user: { [key: string]: string }) => void;
  deleteUser: (key: string, id: string) => void;
  deleteUserScreenshot: (key: string, id: string) => void;
  resetUserData: () => void;
}

const userDataStore = create<UserData>((set) => ({
  userData: [],
  userKeys: [],
  setUserData: (userData: { [key: string]: string }[]) =>
    set(() => ({ userData: userData })),
  setUserKeys: (userKeys: string[]) => set(() => ({ userKeys: userKeys })),
  addUser: (user: { [key: string]: string }) =>
    set((state) => ({ userData: [...state.userData, user] })),
  updateUser: (oldUserId, user: { [key: string]: string }) =>
    set((state) => ({
      userData: state.userData.map((u) =>
        u[state.userKeys[0]] === oldUserId ? { ...u, ...user } : u
      ),
    })),
  deleteUser: (key: string, id: string) =>
    set((state) => ({
      userData: state.userData.filter((u) => u[key] !== id),
    })),
  deleteUserScreenshot: (key: string, id: string) =>
    set((state) => ({
      userData: state.userData.map((user) => {
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
    })),
  resetUserData: () => set(() => ({ userData: [], userKeys: [] })),
}));

export default userDataStore;
