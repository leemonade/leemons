import { create } from 'zustand';

const useContentEditorStore = create((set) => ({
  schema: [],
  setSchema: (schema) => set({ schema }),
  isSchemaOpened: false,
  setIsSchemaOpened: (isSchemaOpened) => set({ isSchemaOpened }),
}));

export { useContentEditorStore };
