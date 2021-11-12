const _ = require('lodash');
const { table } = require('../tables');

async function getProgramKnowledges(ids, { transacting } = {}) {
  return table.knowledges.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
}

module.exports = { getProgramKnowledges };
