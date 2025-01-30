const { assignCustomPeriodToItems } = require('./assignCustomPeriodToItems');
const getMethods = require('./get');
const { remove } = require('./remove');
const { setItem } = require('./setItem');

module.exports = {
  ...getMethods,
  setItem,
  remove,
  assignCustomPeriodToItems,
};
