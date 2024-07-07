import { create } from "zustand";

interface NavigationStore {
  props: {
    allowLeft: boolean;
    allowRight: boolean;
    index: number;
  };
}

interface NavigationActions {
  actions: {
    setAllowLeft: (allowLeft: boolean) => void;
    setAllowRight: (allowRight: boolean) => void;
    incrementIndex: () => void;
    decrementIndex: () => void;
    resetNagivationStore: () => void;
  };
}

const initialProps = {
  allowLeft: false,
  allowRight: false,
  index: 0,
};

const navitationStore = create<NavigationStore & NavigationActions>((set) => ({
  props: initialProps,
  actions: {
    setAllowLeft: (allowLeft: boolean) =>
      set((state) => ({ props: { ...state.props, allowLeft } })),
    setAllowRight: (allowRight: boolean) =>
      set((state) => ({ props: { ...state.props, allowRight } })),
    incrementIndex: () =>
      set((state) => ({
        props: { ...state.props, index: state.props.index + 1 },
      })),
    decrementIndex: () =>
      set((state) => ({
        props: { ...state.props, index: state.props.index - 1 },
      })),
    resetNagivationStore: () =>
      set(() => ({
        props: initialProps,
      })),
  },
}));

export default navitationStore;
