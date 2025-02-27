import { create } from 'zustand';

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

const initialProps: {
  singleUserData: { [key: string]: string };
  singleUserKeys: string[];
} = {
  singleUserData: {},
  singleUserKeys: [],
};

const useSingleUserStore = create<SingleUserProps & SingleUserActions>(
  (set) => ({
    props: initialProps,
    actions: {
      setSingleUserData: (singleUserData) =>
        set({
          props: {
            singleUserData,
            singleUserKeys: Object.keys(singleUserData),
          },
        }),
      resetSingleUserDataStore: () => set({ props: initialProps }),
    },
  })
);

export { useSingleUserStore };
