/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function listCurriculums(
  page,
  size,
  { canListUnpublished, userSession, query = {}, transacting } = {}
) {
  console.log('_.map(userSession.userAgents, )', _.map(userSession.userAgents, 'id'));
  const userServices = leemons.getPlugin('users').services;
  const [[{ actionNames }], centers] = await Promise.all([
    userServices.permissions.getUserAgentPermissions(userSession.userAgents, {
      query: { permissionName: 'plugins.curriculum.curriculum' },
    }),
    userServices.users.getUserAgentCenter(userSession.userAgents),
  ]);

  query.published = true;

  if (canListUnpublished && (actionNames.includes('admin') || actionNames.includes('edit'))) {
    // eslint-disable-next-line no-param-reassign
    delete query.published;
  }

  query.center_$in = _.map(centers, 'id');

  return global.utils.paginate(table.curriculums, page, size, query, {
    transacting,
  });
}

module.exports = { listCurriculums };
