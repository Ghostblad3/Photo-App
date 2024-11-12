import { create } from "zustand";

interface DataStore {
  props: {
    data: { [key: string]: string }[];
    displayableData: { [key: string]: string }[];
  };
}

interface DataActions {
  actions: {
    setData: (data: { [key: string]: string }[]) => void;
    setDisplayableData: (displayableData: { [key: string]: string }[]) => void;
    resetDataStore: () => void;
  };
}

const initialProps: {
  data: { [key: string]: string }[];
  displayableData: { [key: string]: string }[];
} = {
  data: [],
  displayableData: [],
};

const useDataStore = create<DataStore & DataActions>((set) => ({
  props: initialProps,
  actions: {
    setData: (data: { [key: string]: string }[]) =>
      set((state) => ({ props: { ...state.props, data } })),
    setDisplayableData: (displayableData: { [key: string]: string }[]) =>
      set((state) => ({ props: { ...state.props, displayableData } })),
    resetDataStore: () => set({ props: initialProps }),
  },
}));

export default useDataStore;
