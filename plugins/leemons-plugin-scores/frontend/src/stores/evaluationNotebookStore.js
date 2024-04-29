import { isEqual } from 'lodash';

const { create } = require('zustand');

const initialState = {
  filters: null,
  tableData: null,
};

const useEvaluationNotebookStore = create((set, get) => ({
  ...initialState,

  setFilters: (filters) => {
    const prevFilters = get().filters;
    const newFilters = { ...prevFilters, ...filters };

    if (!isEqual(prevFilters, newFilters)) {
      set({ filters: newFilters });
    }
  },
  setTableData: (tableData) => set({ tableData }),
  reset: () => set(initialState),
}));

export default useEvaluationNotebookStore;
