import { create } from "zustand";

type SingleUserData = {
  [key: string]: string;
};

interface SingleUserStore {
  singleUserData: SingleUserData;
  singleUserKeys: string[];
  setSingleUserData: (data: SingleUserData) => void;
  resetSingleUserData: () => void;
}

const singleUserStore = create<SingleUserStore>((set) => ({
  singleUserData: {},
  singleUserKeys: [],
  setSingleUserData: (data) =>
    set({ singleUserData: data, singleUserKeys: Object.keys(data) }),
  resetSingleUserData: () => set({ singleUserData: {}, singleUserKeys: [] }),
}));

export default singleUserStore;
