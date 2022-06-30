const _ = require('lodash');
const { registerDates } = require('../dates');
const { validateAssignableInstance } = require('../../helpers/validators/assignableInstance');
const getAssignable = require('../assignable/getAssignable');
const { registerClass } = require('../classes');
const { assignableInstances } = require('../tables');
const registerPermission = require('./permissions/assignableInstance/assignableInstance/registerPermission');
const addPermissionToUser = require('./permissions/assignableInstance/users/addPermissionToUser');
const createAssignation = require('../assignations/createAssignation');
const addTeachersToAssignableInstance = require('../teachers/addTeachersToAssignableInstance');
const registerEvent = require('./calendar/registerEvent');

async function getTeachersOfGivenClasses(classes, { userSession, transacting } = {}) {
  const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
  const classesData = await academicPortfolioServices.classes.classByIds(classes, {
    userSession,
    transacting,
  });
  const teachers = _.uniqBy(
    classesData.flatMap((classData) => classData.teachers),
    'teacher'
  );

  return teachers;
}

module.exports = async function createAssignableInstance(
  assignableInstance,
  { userSession, transacting, ctx } = {}
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
    isAllDay,
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

  let event = null;

  // EN: Create the assignable instance
  // ES: Crea el asignable instance
  const { id } = await assignableInstances.create(
    {
      ...assignableInstanceObj,
      event,
      metadata: JSON.stringify(metadata),
      curriculum: JSON.stringify(curriculum),
      relatedAssignableInstances: JSON.stringify(
        relatedAssignableInstances.map((instance) => instance.id).filter((instance) => instance)
      ),
    },
    { transacting }
  );

  const newEvent = await registerEvent(assignable, classes, { id, dates, isAllDay, transacting });
  event = newEvent.id;

  // EN: Create the item permission
  // ES: Crea el permiso del item
  await registerPermission(id, assignable.id, { userSession, transacting });

  // EN: Save the classes
  // ES: Guarda las clases
  await registerClass(id, assignable.id, classes, { userSession, transacting });

  // EN: Save the teachers
  // ES: Guarda los profesores
  const teachers = await getTeachersOfGivenClasses(classes, { userSession, transacting });
  await addTeachersToAssignableInstance(
    teachers,
    { id, assignable: assignableInstance.assignable },
    { transacting }
  );
  // EN: Grant users to access event
  // ES: Da permiso a los usuarios para ver el evento
  if (event && teachers && teachers.length) {
    await leemons
      .getPlugin('calendar')
      .services.calendar.grantAccessUserAgentToEvent(event, _.map(teachers, 'teacher'), 'view', {
        transacting,
      });
  }

  // EN: Save the dates
  // ES: Guarda las fechas
  await registerDates('assignableInstance', id, dates, { userSession, transacting });

  if (students.length) {
    // EN: Grant users to access event
    // ES: Da permiso a los usuarios para ver el evento
    if (event) {
      await leemons
        .getPlugin('calendar')
        .services.calendar.grantAccessUserAgentToEvent(event, students, 'view', { transacting });
    }

    // EN: Register the students permissions
    // ES: Registra los permisos de los estudiantes
    await addPermissionToUser(id, assignable.id, students, 'student', { transacting });

    // EN: Create student assignations
    // ES: Crea asignaciones de estudiantes
    await createAssignation.call(
      this,
      id,
      students,
      { indexable: false },
      { userSession, transacting, ctx }
    );
  }

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
