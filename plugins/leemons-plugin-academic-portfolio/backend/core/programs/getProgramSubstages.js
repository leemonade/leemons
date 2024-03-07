const _ = require('lodash');

async function getProgramSubstages({ ids, ctx }) {
  const substages = await ctx.tx.db.Groups.find({
    program: _.isArray(ids) ? ids : [ids],
    type: 'substage',
  }).lean();
  const orderedSubstages = _.orderBy(
    substages,
    ['index', 'abbreviation', 'name'],
    ['asc', 'asc', 'asc']
  );
  return orderedSubstages;
}

module.exports = { getProgramSubstages };
