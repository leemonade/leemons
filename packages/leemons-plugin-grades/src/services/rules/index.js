const { addRule } = require('./addRule');
const { updateRule } = require('./updateRule');
const { removeRule } = require('./removeRule');
const { processRulesForUserAgent } = require('./processRulesForUserAgent');

module.exports = {
  addRule,
  updateRule,
  removeRule,
  processRulesForUserAgent,
};
