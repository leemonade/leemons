const { unregisterClass } = require('../classes');
const unregisterDates = require('../dates/unregisterDates');
const { assignableInstances } = require('../tables');
const getAssignableInstance = require('./getAssignableInstance');
const removePermission = require('./permissions/assignableInstance/assignableInstance/removePermission');

module.exports = async function removeAssignableInstance(
  assignableInstanceId,
  { userSession, transacting } = {}
) {
  // EN: Get the assignable instance
  // ES: Obtiene el asignable instance
  const { relatedAssignableInstances, dates, classes, assignable, event } =
    await getAssignableInstance.call(this, assignableInstanceId, {
      details: true,
      userSession,
      transacting,
    });

  // ES: Si hay evento lo eliminamos
  if (event) {
    const { calendar: calendarService } = leemons.getPlugin('calendar').services;
    await calendarService.removeEvent(event, { transacting });
  }

  // EN: Remove each relatedAssignableInstance
  // ES: Elimina cada relatedAssignableInstance
  if (relatedAssignableInstances?.length) {
    await Promise.all(
      relatedAssignableInstances.map((instance) =>
        removeAssignableInstance.call(this, instance, { userSession, transacting })
      )
    );
  }

  // EN: Unregister dates
  // ES: Desregistra las fechas
  await unregisterDates('assignableInstance', assignableInstanceId, Object.keys(dates), {
    transacting,
  });

  // EN: Remove the user permissions
  // ES: Elimina los permisos del usuario
  // TODO: Remove the user permissions

  // EN: Unregister the classes
  // ES: Desregistra las clases
  await unregisterClass(assignableInstanceId, classes, {
    userSession,
    transacting,
  });

  // EN: Remove the assignable instance permission item
  // ES: Elimina el item de permiso del asignable instance
  await removePermission(assignableInstanceId, assignable.id, { transacting });

  // EN: Remove the assignable instance
  // ES: Elimina el asignable instance
  return assignableInstances.delete({ id: assignableInstanceId }, { transacting });
};
