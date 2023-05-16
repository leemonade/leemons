const _ = require('lodash');
const { table } = require('../tables');

async function getProgramGroups(ids, { transacting } = {}) {
  return table.groups.find(
    { program_$in: _.isArray(ids) ? ids : [ids], type: 'group' },
    { transacting }
  );
}

module.exports = { getProgramGroups };
