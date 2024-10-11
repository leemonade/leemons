const { LeemonsError } = require('@leemons/error');
const { uniq, merge } = require('lodash');

const { unregisterDates } = require('../../dates');
const { getUserPermission } = require('../../permissions/instances/users');
const {
  removePermissionFromUser,
} = require('../../permissions/instances/users/removePermissionFromUser');
const { deleteCommunicaRooms } = require('../createAssignation/helpers/deleteComunicaRooms');

/**
 *
 * @param {object} params
 * @param {object[]} params.assignations - The assignation objects
 * @param {object} params.instance - The instance object
 * @param {import('@leemons/deployment-manager').Context} params.ctx - The Moleculer context
 */
module.exports = async function removeAssignations({ assignations, instance, ctx }) {
  const { actions } = await getUserPermission({ assignableInstance: instance.id, ctx });

  if (!actions.includes('edit')) {
    throw new LeemonsError(ctx, {
      message: 'You do not have permission to delete the requested assignations',
    });
  }

  const assignationIds = assignations.map((assignation) => assignation.id);
  const students = uniq(assignations.map((assignation) => assignation.user));

  if (instance.metadata.createComunicaRooms) {
    const classes = await ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: instance.classes,
      withTeachers: true,
    });

    await deleteCommunicaRooms({
      instance,
      assignations,
      classes,
      ctx,
    });
  }

  await removePermissionFromUser({
    assignableInstance: instance.id,
    assignable: instance.assignable.id,
    userAgents: students,
    role: 'student',
    ctx,
  });

  const timestamps = merge(...assignations.map((assignation) => assignation.timestamps));
  await unregisterDates({
    type: 'assignation',
    instance: assignationIds,
    name: Object.keys(timestamps),
    ctx,
  });

  return ctx.tx.db.Assignations.deleteMany({ id: { $in: assignationIds } });
};
