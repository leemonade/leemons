const { LeemonsError } = require('@leemons/error');

const removeAssignations = require('../../assignations/removeAssignations/removeAssignations');
const { unregisterClass } = require('../../classes');
const { unregisterDates } = require('../../dates/unregisterDates');
const { removePermission } = require('../../permissions/instances/removePermission');
const { getUserPermission } = require('../../permissions/instances/users');
const getTeachersFromAssignableInstance = require('../../teachers/getTeachersFromAssignableInstance');
const {
  removeTeachersFromAssignableInstance,
} = require('../../teachers/removeTeachersFromAssignableInstance');
const { getInstance } = require('../getInstance');

/**
 * Removes an instance.
 *
 * @param {Object} params - The parameters for removing the instance.
 * @param {string} params.id - The ID of the assignable instance to remove.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise} A promise that resolves when the instance is removed.
 */
async function removeInstance({ id, ctx }) {
  const instance = await getInstance({
    id,
    details: true,
    ctx,
  });

  const { metadata, dates, classes, assignable, event, students } = instance;

  const { actions } = await getUserPermission({ assignableInstance: id, ctx });

  if (!actions.includes('edit')) {
    throw new LeemonsError(ctx, {
      message: 'You do not have permission to delete this assignable instance',
    });
  }

  const isModule = metadata?.module?.type === 'module';
  if (isModule) {
    await Promise.all(metadata.module.activities.map(({ id }) => removeInstance({ id, ctx })));
  }

  await removeAssignations({ assignations: students, instance, ctx });

  if (event) {
    await ctx.tx.call('calendar.calendar.removeEvent', { id: event });
  }

  await unregisterDates({
    type: 'assignableInstance',
    instance: id,
    name: Object.keys(dates),
    ctx,
  });

  const teachers = await getTeachersFromAssignableInstance({ assignableInstanceId: id, ctx });
  await removeTeachersFromAssignableInstance({
    teachers: teachers.map((teacher) => teacher.teacher),
    id,
    assignable: assignable.id,
    ctx,
  });

  await unregisterClass({ instance: id, id: classes, ctx });

  await removePermission({
    assignableInstance: id,
    assignable: assignable.id,
    ctx,
  });

  return ctx.tx.db.Instances.deleteOne({ id });
}

module.exports = { removeInstance };
