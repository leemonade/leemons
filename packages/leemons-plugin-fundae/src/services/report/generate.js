const _ = require('lodash');
const { tables } = require('../tables');

async function startGeneration(report) {
  const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;

  const program = await academicPortfolioServices.programs.programsByIds(report.program);

  console.log(program);
}

async function generate(userAgent, program, { course, transacting } = {}) {
  if (_.isArray(userAgent)) {
    return Promise.all(_.map(userAgent, (e) => generate(e, program, { course, transacting })));
  }
  const report = await tables.report.create(
    {
      program,
      course,
      userAgent,
      percentageCompleted: 0,
    },
    { transacting }
  );
  startGeneration(report);
  return report;
}

module.exports = { generate };
