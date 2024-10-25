const { getAssignable } = require('../../assignables/getAssignable');
const { createAssignation } = require('../../assignations/createAssignation');
const { registerClass } = require('../../classes');
const { registerDates } = require('../../dates');
const { validateInstance } = require('../../helpers/validators/instance');
const { registerPermission } = require('../../permissions/instances/registerPermission');
const { addPermissionToUser } = require('../../permissions/instances/users/addPermissionToUser');
const {
  addTeachersToAssignableInstance,
} = require('../../teachers/addTeachersToAssignableInstance');
const { updateInstance } = require('../updateInstance');

const { createEventAndAddToUsers } = require('./createEventAndAddToUsers');
const { emitLeemonsEvent } = require('./emitLeemonsEvent');
const { getTeachersOfGivenClasses } = require('./getTeachersOfGivenClasses');

async function createInstance({ assignableInstance, createEvent = true, ctx }) {
  // EN: Validate the assignable instance properties
  // ES: Validar las propiedades del asignable instance
  validateInstance({ assignable: assignableInstance, useRequired: true });

  const {
    dates,
    classes,
    metadata,
    curriculum,
    relatedAssignables,
    students,
    isAllDay,
    relatedAssignableInstances,
    sendMail,
    ...assignableInstanceObj
  } = assignableInstance;

  // EN: Check that the assignable exists (if not, it will throw)
  // ES: Comprueba que el asignable existe (if not, it will throw)
  const assignable = await getAssignable({
    id: assignableInstance.assignable,
    ctx,
  });

  // EN: Create the assignable instance
  // ES: Crea el asignable instance
  const { id } = (
    await ctx.tx.db.Instances.create({
      ...assignableInstanceObj,
      event: null, // Not created yet due to instance.id dependency
      sendMail: !!sendMail,
      metadata,
      curriculum,
      relatedAssignableInstances: { before: [], after: [] },
    })
  ).toObject();

  // EN: Create the item permission
  // ES: Crea el permiso del item
  await registerPermission({ assignableInstance: id, assignable: assignable.id, ctx });

  // EN: Save the classes
  // ES: Guarda las clases
  await registerClass({ instance: id, assignable: assignable.id, id: classes, ctx });

  // EN: Save the teachers
  // ES: Guarda los profesores
  const teachers = await getTeachersOfGivenClasses({ classes, ctx });
  await addTeachersToAssignableInstance({
    teachers,
    id,
    assignable: assignableInstance.assignable,
    ctx,
  });

  if (createEvent) {
    const event = await createEventAndAddToUsers({
      assignable,
      classes,
      dates,
      id,
      isAllDay,
      teachers,
      students,
      ctx,
    });

    await ctx.tx.db.Instances.updateOne({ id }, { event });
  }

  // EN: Save the dates
  // ES: Guarda las fechas
  await registerDates({ type: 'assignableInstance', instance: id, dates, ctx });

  if (
    relatedAssignableInstances?.before?.length ||
    relatedAssignableInstances?.after?.length ||
    relatedAssignableInstances?.blocking?.length
  ) {
    await updateInstance({
      assignableInstance: {
        id,
        relatedAssignableInstances,
      },
      ctx,
    });
  }

  // !Important: Take into account that changes in here are also needed in addStudentToOpenInstancesWithClass
  if (students.length) {
    // EN: Register the students permissions
    // ES: Registra los permisos de los estudiantes
    await addPermissionToUser({
      assignableInstance: id,
      assignable: assignable.id,
      userAgents: students,
      role: 'student',
      ctx,
    });

    // EN: Create student assignations
    // ES: Crea asignaciones de estudiantes
    await createAssignation({
      assignableInstanceId: id,
      users: students,
      options: { indexable: false },
      ctx,
    });
  }

  emitLeemonsEvent({
    assignable,
    instance: id,
    ctx,
  });

  return {
    id,
    students,
    dates,
    classes,
    metadata,
    curriculum,
    relatedAssignableInstances,
  };
}

module.exports = { createInstance };
