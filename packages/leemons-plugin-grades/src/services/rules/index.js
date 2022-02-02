const { addRule } = require('./addRule');
const { listRules } = require('./listRules');
const { updateRule } = require('./updateRule');
const { removeRule } = require('./removeRule');
const { processRulesForUserAgent } = require('./processRulesForUserAgent');

module.exports = {
  addRule,
  listRules,
  updateRule,
  removeRule,
  processRulesForUserAgent,
};
