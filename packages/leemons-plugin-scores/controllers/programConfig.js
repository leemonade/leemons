const _ = require('lodash');
const programConfigService = require('../src/services/program-config');

async function haveAcademicCalendarConfigForProgram(ctx) {
  ctx.status = 200;
  ctx.body = { status: 200, dataset };
}

async function getProgramConfig(ctx) {}

module.exports = {
  getProgramConfig,
  haveAcademicCalendarConfigForProgram,
};
