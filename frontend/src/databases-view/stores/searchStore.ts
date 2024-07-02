import { create } from "zustand";

interface SearchStoreProps {
  props: {
    searchField: string;
    searchValue: string;
  };
}

interface SearchStoreActions {
  actions: {
    setSearchField: (value: string) => void;
    setSearchValue: (value: string) => void;
    resetSeachStore: () => void;
  };
}

const initialProps = {
  searchField: "",
  searchValue: "",
};

const searchStore = create<SearchStoreProps & SearchStoreActions>((set) => ({
  props: { searchField: "", searchValue: "" },
  actions: {
    setSearchField: (value) =>
      set((state) => ({ props: { ...state.props, searchField: value } })),
    setSearchValue: (value) =>
      set((state) => ({ props: { ...state.props, searchValue: value } })),
    resetSeachStore: () => set(() => ({ props: initialProps })),
  },
}));

export default searchStore;
