import { create } from "zustand";

interface AvailableKeysProps {
  props: {
    availableKeys: string[];
    selectedKeys: string[];
  };
}

interface AvailableKeysActions {
  actions: {
    setAvailableKeys: (availableKeys: string[]) => void;
    setSelectedKeys: (selectedKeys: string[]) => void;
    resetAvailableKeysStore: () => void;
  };
}

const initialProps: { availableKeys: string[]; selectedKeys: string[] } = {
  availableKeys: [],
  selectedKeys: [],
};

const useAvailableKeysStore = create<AvailableKeysProps & AvailableKeysActions>(
  (set) => ({
    props: initialProps,
    actions: {
      setAvailableKeys: (availableKeys) =>
        set((state) => ({ props: { ...state.props, availableKeys } })),
      setSelectedKeys: (selectedKeys) =>
        set((state) => ({ props: { ...state.props, selectedKeys } })),
      resetAvailableKeysStore: () => set({ props: initialProps }),
    },
  })
);

export default useAvailableKeysStore;
