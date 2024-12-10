import { isEqual } from 'lodash';

const { create } = require('zustand');

const initialState = {
  filters: null,
  tableData: null,
  isPeriodPublished: false,
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
  setIsPeriodPublished: (isPeriodPublished) => set({ isPeriodPublished }),
}));

export default useEvaluationNotebookStore;
