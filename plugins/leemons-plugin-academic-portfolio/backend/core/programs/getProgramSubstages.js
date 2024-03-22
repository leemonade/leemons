const _ = require('lodash');

async function getProgramSubstages({ ids, options = {}, ctx }) {
  const substages = await ctx.tx.db.Groups.find(
    {
      program: _.isArray(ids) ? ids : [ids],
      type: 'substage',
    },
    '',
    options
  ).lean();
  return _.orderBy(substages, ['index', 'abbreviation', 'name'], ['asc', 'asc', 'asc']);
}

module.exports = { getProgramSubstages };
