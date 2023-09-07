/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listCurriculums({ page, size, canListUnpublished, query = {}, ctx }) {
  const { userSession } = ctx.meta;
  const [[{ actionNames }], centers] = await Promise.all([
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: userSession.userAgents,
      query: { permissionName: 'curriculum.curriculum' },
    }),
    ctx.tx.call('users.users.getUserAgentCenter', { userAgent: userSession.userAgents }),
  ]);

  query.published = true;

  if (canListUnpublished && (actionNames.includes('admin') || actionNames.includes('edit'))) {
    // eslint-disable-next-line no-param-reassign
    delete query.published;
  }

  query.center = _.map(centers, 'id');

  return mongoDBPaginate({
    model: ctx.tx.db.Curriculums,
    page,
    size,
    query,
  });
}

module.exports = { listCurriculums };
