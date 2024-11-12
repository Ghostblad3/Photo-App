import { create } from "zustand";

interface SingleUserProps {
  props: {
    singleUserData: { [key: string]: string };
    singleUserKeys: string[];
  };
}

interface SingleUserActions {
  actions: {
    setSingleUserData: (singleUserData: { [key: string]: string }) => void;
    resetSingleUserDataStore: () => void;
  };
}

const initProps: {
  singleUserData: { [key: string]: string };
  singleUserKeys: string[];
} = {
  singleUserData: {},
  singleUserKeys: [],
};

const useSingleUserStore = create<SingleUserProps & SingleUserActions>(
  (set) => ({
    props: initProps,
    actions: {
      setSingleUserData: (singleUserData) =>
        set({
          props: {
            singleUserData,
            singleUserKeys: Object.keys(singleUserData),
          },
        }),
      resetSingleUserDataStore: () => set({ props: initProps }),
    },
  })
);

export default useSingleUserStore;
