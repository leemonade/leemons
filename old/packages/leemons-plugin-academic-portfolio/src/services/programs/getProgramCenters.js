const _ = require('lodash');
const { table } = require('../tables');

async function getProgramCenters(programId, { transacting } = {}) {
  const pc = await table.programCenter.find({ program: programId }, { transacting });
  return _.map(pc, 'center');
}

module.exports = { getProgramCenters };
