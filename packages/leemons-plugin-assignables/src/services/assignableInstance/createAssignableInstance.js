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

// eslint-disable-next-line no-use-before-define
module.exports = createAssignableInstance;

const updateAssignableInstance = require('./updateAssignableInstance');

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

async function createEventAndAddToUsers(
  { assignable, classes, id, dates, isAllDay, teachers, students },
  { transacting }
) {
  const { id: event } = await registerEvent(assignable, classes, {
    id,
    dates,
    isAllDay,
    transacting,
  });

  // EN: Grant users to access event
  // ES: Da permiso a los usuarios para ver el evento
  if (event && teachers && teachers.length) {
    await leemons
      .getPlugin('calendar')
      .services.calendar.grantAccessUserAgentToEvent(event, _.map(teachers, 'teacher'), 'view', {
        transacting,
      });
  }

  if (students.length) {
    // EN: Grant users to access event
    // ES: Da permiso a los usuarios para ver el evento
    if (event) {
      await leemons
        .getPlugin('calendar')
        .services.calendar.grantAccessUserAgentToEvent(event, students, 'view', {
          transacting,
        });
    }
  }

  return event;
}

function emitLeemonsEvent({ assignable, instance }) {
  const { role, id } = assignable;

  const payload = {
    role,
    assignable: id,
    instance,
  };
  leemons.events.emit(`instance.created`, payload);
  leemons.events.emit(`role.${role}.instance.created`, payload);
}

async function createAssignableInstance(
  assignableInstance,
  { userSession, transacting: t, ctx, createEvent = true } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
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
        relatedAssignableInstances,
        sendMail,
        ...assignableInstanceObj
      } = assignableInstance;

      // EN: Check that the assignable exists (if not, it will throw)
      // ES: Comprueba que el asignable existe (if not, it will throw)
      const assignable = await getAssignable.call(this, assignableInstance.assignable, {
        userSession,
        transacting,
      });

      // EN: Create the assignable instance
      // ES: Crea el asignable instance
      const { id } = await assignableInstances.create(
        {
          ...assignableInstanceObj,
          event: null, // Not created yet due to instance.id dependency
          sendMail: !!sendMail,
          metadata: JSON.stringify(metadata),
          curriculum: JSON.stringify(curriculum),
          relatedAssignableInstances: JSON.stringify({ before: [], after: [] }),
        },
        { transacting }
      );

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

      if (createEvent) {
        const event = await createEventAndAddToUsers(
          {
            assignable,
            classes,
            dates,
            id,
            isAllDay,
            teachers,
            students,
          },
          { transacting }
        );

        await assignableInstances.update({ id }, { event });
      }

      // EN: Save the dates
      // ES: Guarda las fechas
      await registerDates('assignableInstance', id, dates, { userSession, transacting });

      if (
        relatedAssignableInstances?.before?.length ||
        relatedAssignableInstances?.after?.length ||
        relatedAssignableInstances?.blocking?.length
      ) {
        await updateAssignableInstance.call(
          this,
          {
            id,
            relatedAssignableInstances,
          },
          { transacting, userSession }
        );
      }

      if (students.length) {
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

      emitLeemonsEvent({
        assignable,
        instance: id,
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
    },
    assignableInstances,
    t
  );
}
