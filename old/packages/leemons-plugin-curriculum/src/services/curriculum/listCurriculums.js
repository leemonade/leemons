/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function listCurriculums(
  page,
  size,
  { canListUnpublished, userSession, query = {}, transacting } = {}
) {
  const [{ actionNames }] = await leemons
    .getPlugin('users')
    .services.permissions.getUserAgentPermissions(userSession.userAgents, {
      query: { permissionName: 'plugins.curriculum.curriculum' },
    });

  query.published = true;

  if (canListUnpublished && (actionNames.includes('admin') || actionNames.includes('edit'))) {
    // eslint-disable-next-line no-param-reassign
    delete query.published;
  }

  return global.utils.paginate(table.curriculums, page, size, query, {
    transacting,
  });
}

module.exports = { listCurriculums };
