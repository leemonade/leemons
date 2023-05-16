const _ = require('lodash');
const { table } = require('../tables');
const { getGeneral } = require('./getGeneral');
const { getCenter } = require('./getCenter');
const { getProgram } = require('./getProgram');

async function getFullByCenter(center, { transacting } = {}) {
  const programsService = leemons.getPlugin('academic-portfolio').services.programs;
  const programIds = await programsService.programsByCenters(center, {
    transacting,
    returnIds: true,
  });
  const results = await Promise.all([
    getGeneral({ transacting }),
    getCenter(center, { transacting }),
    Promise.all(_.map(programIds, (program) => getProgram(program, { transacting }))),
  ]);

  const program = {};
  _.forEach(programIds, (p, i) => {
    program[p] = results[2][i];
  });

  return {
    ...results[0],
    ...results[1],
    program,
  };
}

module.exports = { getFullByCenter };
