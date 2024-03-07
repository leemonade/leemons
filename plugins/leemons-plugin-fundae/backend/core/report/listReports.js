const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listReports({ page, size, filters = {}, ctx }) {
  const response = await mongoDBPaginate({
    model: ctx.tx.db.Report,
    page,
    size,
    query: { ...filters },
    sort: { createdAt: 1 },
  });

  const [userAgents, programs] = await Promise.all([
    ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentsIds: _.map(response.items, 'userAgent'),
    }),
    ctx.tx.call('academic-portfolio.programs.programsByIds', {
      ids: _.map(response.items, 'program'),
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
