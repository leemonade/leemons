const _ = require('lodash');
const { table } = require('../tables');

async function getProgramSubstages(ids, { transacting } = {}) {
  const substages = await table.groups.find(
    { program_$in: _.isArray(ids) ? ids : [ids], type: 'substage' },
    { transacting }
  );
  const orderedSubstages = _.orderBy(
    substages,
    ['index', 'abbreviation', 'name'],
    ['asc', 'asc', 'asc']
  );
  return orderedSubstages;
}

module.exports = { getProgramSubstages };
