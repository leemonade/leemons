const _ = require('lodash');
const { table } = require('../tables');
const { ruleByIds } = require('./ruleByIds');

async function listRules(page, size, center, { isDependency = false, transacting } = {}) {
  const results = await global.utils.paginate(
    table.rules,
    page,
    size,
    { center, isDependency },
    {
      transacting,
    }
  );

  results.items = await ruleByIds(_.map(results.items, 'id'), { transacting });

  return results;
}

module.exports = { listRules };
