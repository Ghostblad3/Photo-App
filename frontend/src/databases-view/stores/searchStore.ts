import { create } from "zustand";

interface SearchStoreProps {
  props: {
    searchField: string;
    searchValue: string;
  };
}

interface SearchStoreActions {
  actions: {
    setSearchField: (searchField: string) => void;
    setSearchValue: (searchValue: string) => void;
    resetSearchStore: () => void;
  };
}

const initialProps = {
  searchField: "",
  searchValue: "",
};

const useSearchStore = create<SearchStoreProps & SearchStoreActions>((set) => ({
  props: initialProps,
  actions: {
    setSearchField: (searchField) =>
      set((state) => ({ props: { ...state.props, searchField } })),
    setSearchValue: (searchValue) =>
      set((state) => ({ props: { ...state.props, searchValue } })),
    resetSearchStore: () => set(() => ({ props: initialProps })),
  },
}));

export default useSearchStore;
