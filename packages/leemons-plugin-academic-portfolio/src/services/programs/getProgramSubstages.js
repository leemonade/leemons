const _ = require('lodash');
const { table } = require('../tables');

async function getProgramSubstages(ids, { transacting } = {}) {
  return table.groups.find(
    { program_$in: _.isArray(ids) ? ids : [ids], type: 'substage' },
    { transacting }
  );
}

module.exports = { getProgramSubstages };
