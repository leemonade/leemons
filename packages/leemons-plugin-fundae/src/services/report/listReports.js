const _ = require('lodash');
const { tables } = require('../tables');

async function listReports(page, size, program, course, { transacting } = {}) {
  const response = await global.utils.paginate(
    tables.report,
    page,
    size,
    { $sort: 'created_at:desc' },
    {
      transacting,
    }
  );

  const userServices = leemons.getPlugin('users').services;
  const userAgents = await userServices.users.getUserAgentsInfo(_.map(response.items, 'userAgent'));

  const userAgentsById = _.keyBy(userAgents, 'id');

  response.items = _.map(response.items, (item) => ({
    ...item,
    userAgent: userAgentsById[item.userAgent],
  }));

  return response;
}

module.exports = { listReports };
