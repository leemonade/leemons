const { getFilters, addFilter, removeFilter } = require('./filters');
const { getActions, addAction, removeAction } = require('./actions');
const { fireEvent } = require('./events');

module.exports = {
  fireEvent,
  addFilter,
  addAction,
  getFilters,
  getActions,
  removeFilter,
  removeAction,
};
