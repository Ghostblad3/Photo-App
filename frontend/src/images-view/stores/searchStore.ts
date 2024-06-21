import { create } from "zustand";

interface SearchStore {
  searchField: string;
  searchValue: string;
  setSearchField: (value: string) => void;
  setSearchValue: (value: string) => void;
  resetSearch: () => void;
}

const searchStore = create<SearchStore>((set) => ({
  searchField: "",
  searchValue: "",
  setSearchField: (value) => set(() => ({ searchField: value })),
  setSearchValue: (value) => set(() => ({ searchValue: value })),
  resetSearch: () => set(() => ({ searchField: "", searchValue: "" })),
}));

export default searchStore;
