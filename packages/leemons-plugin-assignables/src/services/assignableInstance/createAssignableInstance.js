const _ = require('lodash');
const { registerDates } = require('../dates');
const { validateAssignableInstance } = require('../../helpers/validators/assignableInstance');
const getAssignable = require('../assignable/getAssignable');
const { registerClass } = require('../classes');
const { assignableInstances } = require('../tables');
const registerPermission = require('./permissions/assignableInstance/assignableInstance/registerPermission');
const addPermissionToUser = require('./permissions/assignableInstance/users/addPermissionToUser');

module.exports = async function createAssignableInstance(
  assignableInstance,
  { userSession, transacting } = {}
) {
  // EN: Validate the assignable instance properties
  // ES: Validar las propiedades del asignable instance
  validateAssignableInstance(assignableInstance, { useRequired: true });

  const {
    dates,
    classes,
    metadata,
    curriculum,
    relatedAssignables,
    students,
    ...assignableInstanceObj
  } = assignableInstance;

  // EN: Check that the assignable exists (if not, it will throw)
  // ES: Comprueba que el asignable existe (if not, it will throw)
  const assignable = await getAssignable.call(this, assignableInstance.assignable, {
    userSession,
    transacting,
  });

  // EN: Check if the assignable has related assignables and create them
  // ES: Comprueba si el asignable tiene asignables relacionados y los crea
  const relatedAssignableInstances = [];
  if (
    assignable.relatedAssignables?.after?.length ||
    assignable.relatedAssignables?.before?.length
  ) {
    const assignables = _.concat(
      assignable?.relatedAssignables?.after,
      assignable?.relatedAssignables?.before
    );

    // EN: Create the assignableInstance of each related assignable
    // ES: Crea el asignableInstance de cada asignable relacionado
    relatedAssignableInstances.push(
      ...(await Promise.all(
        assignables.map((ass) =>
          createAssignableInstance.call(
            this,
            {
              // EN: If no info provided for the assignable, use the info of the parent assignableInstance
              // ES: Si no se proporciona información para el asignable, usa la información del asignableInstance padre
              ...assignableInstance,
              assignable: ass.id,
              ..._.get(relatedAssignables, assignable.id, {}),
            },
            { userSession, transacting }
          )
        )
      ))
    );
  }

  // EN: Create the assignable instance
  // ES: Crea el asignable instance
  const { id } = await assignableInstances.create(
    {
      ...assignableInstanceObj,

      metadata: JSON.stringify(metadata),
      curriculum: JSON.stringify(curriculum),
      relatedAssignableInstances: JSON.stringify(
        relatedAssignableInstances.map((instance) => instance.id).filter((instance) => instance)
      ),
    },
    { transacting }
  );

  // EN: Create the item permission
  // ES: Crea el permiso del item
  await registerPermission(id, assignable.id, { userSession, transacting });

  // EN: Save the classes
  // ES: Guarda las clases
  await registerClass(id, assignable.id, classes, { userSession, transacting });

  // EN: Register the students permissions
  // ES: Registra los permisos de los estudiantes
  if (students.length) {
    await addPermissionToUser(
      id,
      assignable.id,
      students.map((s) => s.id),
      'student',
      { transacting }
    );
  }

  // TODO: Create the student instance object

  // EN: Save the dates
  // ES: Guarda las fechas
  await registerDates('assignableInstance', id, dates, { userSession, transacting });

  return {
    ...assignableInstanceObj,
    id,
    students,
    dates,
    classes,
    metadata,
    curriculum,
    relatedAssignableInstances,
  };
};
