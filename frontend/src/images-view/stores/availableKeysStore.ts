import { create } from "zustand";

// type AvailableKey = { key: string; id: string };

interface AvailableKeysStore {
  availableKeys: string[];
  selectedKeys: string[];
  setAvailableKeys: (selectedKeys: string[]) => void;
  setSelectedKeys: (selectedKeys: string[]) => void;
  resetAvailableKeysStore: () => void;
}

const useAvailableKeysStore = create<AvailableKeysStore>((set) => ({
  availableKeys: [],
  selectedKeys: [],
  setAvailableKeys: (availableKeys) => set({ availableKeys }),
  setSelectedKeys: (selectedKeys) => set({ selectedKeys }),
  resetAvailableKeysStore: () => set({ availableKeys: [], selectedKeys: [] }),
}));

export default useAvailableKeysStore;
