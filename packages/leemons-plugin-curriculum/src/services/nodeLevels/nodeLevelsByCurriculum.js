const _ = require('lodash');
const { table } = require('../tables');

async function nodeLevelsByCurriculum(ids, { transacting } = {}) {
  return table.nodeLevels.find({ curriculum_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
}

module.exports = { nodeLevelsByCurriculum };
