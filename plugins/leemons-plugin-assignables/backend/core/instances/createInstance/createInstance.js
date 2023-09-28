const { registerDates } = require('../../dates');
const { validateAssignableInstance } = require('../../helpers/validators/assignableInstance');
const { getAssignable } = require('../../assignables/getAssignable');
const { registerClass } = require('../../classes');
const { registerPermission } = require('../../permissions/instances/registerPermission');
const { addPermissionToUser } = require('../../permissions/users/instances/addPermissionToUser');
const { createAssignation } = require('../../assignations/createAssignation');
const {
  addTeachersToAssignableInstance,
} = require('../../teachers/addTeachersToAssignableInstance');

const { updateAssignableInstance } = require('../updateAssignableInstance');

const { getTeachersOfGivenClasses } = require('./getTeachersOfGivenClasses');
const { createEventAndAddToUsers } = require('./createEventAndAddToUsers');
const { emitLeemonsEvent } = require('./emitLeemonsEvent');

async function createInstance({ assignableInstance, createEvent = true, ctx }) {
  // EN: Validate the assignable instance properties
  // ES: Validar las propiedades del asignable instance
  validateAssignableInstance({ assignable: assignableInstance, useRequired: true });

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
      metadata: JSON.stringify(metadata),
      curriculum: JSON.stringify(curriculum),
      relatedAssignableInstances: JSON.stringify({ before: [], after: [] }),
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
    await updateAssignableInstance({
      assignableInstance: {
        id,
        relatedAssignableInstances,
      },
      ctx,
    });
  }

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
