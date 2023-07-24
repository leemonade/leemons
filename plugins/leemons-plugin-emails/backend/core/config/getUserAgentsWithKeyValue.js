const _ = require('lodash');

async function getUserAgentsWithKeyValue({ key, value, ctx } = {}) {
  const query = {
    key,
  };
  if (value) {
    query.value = JSON.stringify(value);
  } else {
    query.value = { $neq: JSON.stringify(false) };
  }

  const configs = await ctx.tx.db.Config.find(query, ['userAgent', 'value']).lean();

  if (value) {
    return _.map(configs, 'userAgent');
  }

  const result = {};
  _.forEach(configs, ({ userAgent, value: v }) => {
    result[userAgent] = JSON.parse(v);
  });
  return result;
}

module.exports = { getUserAgentsWithKeyValue };
