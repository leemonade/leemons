import { isEqual } from 'lodash';

const { create } = require('zustand');

const initialState = {
  filters: null,
  columns: new Map(),
  finalScores: new Map(),
  classes: [],
};

const useMyScoresStore = create((set, get) => ({
  ...initialState,

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  addColumn: (column, data) => {
    const newColumns = new Map(get().columns);

    if (!isEqual(newColumns.get(column), data)) {
      newColumns.set(column, data);

      set({ columns: newColumns });
    }
  },
  removeColumn: (column) => {
    const newColumns = new Map(get().columns);
    const wasDeleted = newColumns.delete(column);

    if (wasDeleted) {
      set({ columns: newColumns });
    }
  },
  setFinalScore: (klass, data) => {
    const newFinalScores = new Map(get().finalScores);

    if (!isEqual(newFinalScores.get(klass), data)) {
      newFinalScores.set(klass, data);
      set({ finalScores: newFinalScores });
    }
  },
  setClasses: (classes) => set({ classes }),
  reset: () => set(initialState),
}));

export default useMyScoresStore;
