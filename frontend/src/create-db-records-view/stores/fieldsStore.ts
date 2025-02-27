import { create } from 'zustand';

interface FieldsProps {
  props: {
    fields: string[];
    visibleFields: string[];
  };
}

interface FieldsActions {
  actions: {
    setFields: (fields: string[]) => void;
    setVisibleFields: (visibleFields: string[]) => void;
    resetFieldsStore: () => void;
  };
}

const initialProps: { fields: string[]; visibleFields: string[] } = {
  fields: [],
  visibleFields: [],
};

const useFieldsStore = create<FieldsProps & FieldsActions>((set) => ({
  props: initialProps,
  actions: {
    setFields: (fields: string[]) =>
      set((state) => ({ props: { ...state.props, fields } })),
    setVisibleFields: (visibleFields: string[]) =>
      set((state) => ({ props: { ...state.props, visibleFields } })),
    resetFieldsStore: () => set({ props: initialProps }),
  },
}));

export { useFieldsStore };
