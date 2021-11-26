const _ = require('lodash');
const { table } = require('../tables');

async function subjectByIds(ids, { transacting } = {}) {
  return table.subjects.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
}

module.exports = { subjectByIds };
