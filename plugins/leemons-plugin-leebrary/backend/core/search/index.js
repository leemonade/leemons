const { byCriteria } = require('./byCriteria');
const { byDescription } = require('./byDescription');
const { byName } = require('./byName');
const { byProvider } = require('./byProvider');
const { list } = require('./list');

module.exports = {
  list,
  search: byCriteria,
  byCriteria,
  byDescription,
  byName,
  byProvider,
};
