const { create } = require('zustand');

const initialState = {
  filters: null,
  tableData: null,
};

const useEvaluationNotebookStore = create((set, get) => ({
  ...initialState,

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  setTableData: (tableData) => set({ tableData }),
  reset: () => set(initialState),
}));

export default useEvaluationNotebookStore;
