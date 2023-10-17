const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const { ruleByIds } = require('./ruleByIds');

async function listRules({ page, size, center, isDependency = false, ctx }) {
  const results = await mongoDBPaginate({
    model: ctx.tx.db.Rules,
    page,
    size,
    query: { center, isDependency },
  });

  results.items = await ruleByIds({ ids: _.map(results.items, 'id'), ctx });

  return results;
}

module.exports = { listRules };
