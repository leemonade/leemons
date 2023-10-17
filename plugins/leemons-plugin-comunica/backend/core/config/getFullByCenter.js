const _ = require('lodash');
const { getGeneral } = require('./getGeneral');
const { getCenter } = require('./getCenter');
const { getProgram } = require('./getProgram');

async function getFullByCenter({ center, ctx }) {
  const programIds = await ctx.tx.call('academic-portfolio.programs.programsByCenters', {
    centerIds: center,
    returnIds: true,
  });
  const results = await Promise.all([
    getGeneral({ ctx }),
    getCenter({ center, ctx }),
    Promise.all(_.map(programIds, (program) => getProgram({ program, ctx }))),
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
