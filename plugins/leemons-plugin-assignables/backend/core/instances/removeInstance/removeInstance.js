const { unregisterClass } = require('../../classes');
const { unregisterDates } = require('../../dates/unregisterDates');
const { getInstance } = require('../getInstance');
const { removePermission } = require('../../permissions/instances/removePermission');

/**
 * Removes an instance.
 *
 * @param {Object} params - The parameters for removing the instance.
 * @param {string} params.assignableInstanceId - The ID of the assignable instance to remove.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise} A promise that resolves when the instance is removed.
 */
async function removeInstance({ assignableInstanceId, ctx }) {
  // EN: Get the assignable instance
  // ES: Obtiene el asignable instance
  const { relatedAssignableInstances, dates, classes, assignable, event } = await getInstance({
    id: assignableInstanceId,
    details: true,
    ctx,
  });

  // ES: Si hay evento lo eliminamos
  if (event) {
    await ctx.tx.call('calendar.calendar.removeEvent', { id: event });
  }

  // EN: Remove each relatedAssignableInstance
  // ES: Elimina cada relatedAssignableInstance
  if (relatedAssignableInstances?.length) {
    await Promise.all(
      relatedAssignableInstances.map((instance) =>
        removeInstance({ assignableInstanceId: instance, ctx })
      )
    );
  }

  // EN: Unregister dates
  // ES: Desregistra las fechas
  await unregisterDates({
    type: 'assignableInstance',
    instance: assignableInstanceId,
    name: Object.keys(dates),
    ctx,
  });

  // EN: Remove the user permissions
  // ES: Elimina los permisos del usuario
  // TODO: Remove the user permissions

  // EN: Unregister the classes
  // ES: Desregistra las clases
  await unregisterClass({ instance: assignableInstanceId, id: classes, ctx });

  // EN: Remove the assignable instance permission item
  // ES: Elimina el item de permiso del asignable instance
  await removePermission({
    asignableInstance: assignableInstanceId,
    assignable: assignable.id,
    ctx,
  });

  // EN: Remove the assignable instance
  // ES: Elimina el asignable instance
  return ctx.tx.db.Instances.deleteOne({ id: assignableInstanceId });
}

module.exports = { removeInstance };
