const { addRule } = require('./addRule');
const { haveRules } = require('./haveRules');
const { listRules } = require('./listRules');
const { updateRule } = require('./updateRule');
const { removeRule } = require('./removeRule');
const { processRulesForUserAgent } = require('./processRulesForUserAgent');

module.exports = {
  addRule,
  haveRules,
  listRules,
  updateRule,
  removeRule,
  processRulesForUserAgent,
};
