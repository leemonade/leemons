const _ = require('lodash');
const { tables } = require('../tables');

async function listReports(page, size, { filters = {}, transacting } = {}) {
  const response = await global.utils.paginate(
    tables.report,
    page,
    size,
    { $sort: 'created_at:desc', ...filters },
    {
      transacting,
    }
  );

  const userServices = leemons.getPlugin('users').services;
  const academicPortfolio = leemons.getPlugin('academic-portfolio').services;
  const [userAgents, programs] = await Promise.all([
    userServices.users.getUserAgentsInfo(_.map(response.items, 'userAgent')),
    academicPortfolio.programs.programsByIds(_.map(response.items, 'program'), {
      onlyProgram: true,
    }),
  ]);

  const programsById = _.keyBy(programs, 'id');
  const userAgentsById = _.keyBy(userAgents, 'id');

  response.items = _.map(response.items, (item) => ({
    ...item,
    userAgent: userAgentsById[item.userAgent],
    program: programsById[item.program],
  }));

  return response;
}

module.exports = { listReports };
