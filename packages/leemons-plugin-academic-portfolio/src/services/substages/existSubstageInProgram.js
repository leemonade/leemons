const _ = require('lodash');
const { table } = require('../tables');

async function existSubstageInProgram(id, program, { transacting } = {}) {
  const ids = _.isArray(id) ? id : [id];
  const count = await table.groups.count(
    { id_$in: ids, program, type: 'substage' },
    { transacting }
  );
  return count === ids.length;
}

module.exports = { existSubstageInProgram };
