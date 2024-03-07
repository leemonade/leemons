const { byCriteria } = require('./byCriteria');
const { byDescription } = require('./byDescription');
const { byName } = require('./byName');
const { byProvider } = require('./byProvider');

module.exports = {
  search: byCriteria,
  byCriteria,
  byDescription,
  byName,
  byProvider,
};
