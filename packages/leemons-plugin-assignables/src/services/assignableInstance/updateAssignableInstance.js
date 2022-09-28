const _ = require('lodash');
const { validateAssignableInstance } = require('../../helpers/validators/assignableInstance');
const updateClasses = require('../classes/updateClasses');
const updateDates = require('../dates/updateDates');
const { assignableInstances } = require('../tables');
const getAssignableInstance = require('./getAssignableInstance');
const getUserPermission = require('./permissions/assignableInstance/users/getUserPermission');
const updateEvent = require('./calendar/updateEvent');
const registerEvent = require('./calendar/registerEvent');
const { listAssignableInstanceClasses } = require('../classes');
const createAssignableInstance = require('./createAssignableInstance');

const { getDiff } = global.utils;

const updatableFields = [
  'alwaysAvailable',
  'dates',
  'duration',
  'gradable',
  'classes',
  'students',
  'messagToAssignees',
  'curriculum',
  'metadata',
  'addNewClassStudents',
  'showResults',
  'showCorrectAnsers',
  'relatedAssignableInstances',
];

async function createRelatedInstance(
  { caller, instance, type, propagate = true },
  { userSession, transacting } = {}
) {
  const oppositeType = type === 'before' ? 'after' : 'before';

  // EN: Given instance is an id
  // ES: La instancia dada es un id
  if (typeof instance === 'string') {
    const relatedInstance = await getAssignableInstance.call(this, instance, {
      userSession,
      transacting,
    });
    if (!relatedInstance) {
      throw new Error(`The related instance ${instance} does not exists`);
    }

    // EN: Update the relatedInstance to add the current instance as related
    // ES: Actualizar la instancia relacionada para añadir la instancia actual como relacionada
    if (propagate) {
      // eslint-disable-next-line no-use-before-define
      await updateAssignableInstance.call(
        this,
        {
          id: instance,
          relatedAssignableInstances: {
            [type]: relatedInstance.relatedAssignableInstances?.[type] || [],
            [oppositeType]: _.uniq([
              ...(relatedInstance.relatedAssignableInstances?.[oppositeType] || []),
              caller,
            ]),
          },
        },
        { userSession, transacting, propagateRelated: false }
      );
    }

    return instance;
  }

  // EN: Given instance is an object
  // ES: La instance dada es un objeto

  // eslint-disable-next-line no-use-before-define
  const createdInstance = await createAssignableInstance.call(
    this,
    {
      ...instance,
      relatedAssignableInstances: {
        [type]: instance.relatedAssignableInstances?.[type] || [],
        [oppositeType]: _.uniq([
          ...(instance.relatedAssignableInstances?.[oppositeType] || []),
          caller.id,
        ]),
      },
    },
    {
      userSession,
      transacting,
    }
  );

  return createdInstance;
}

async function updateAssignableInstance(
  assignableInstance,
  { userSession, transacting, propagateRelated } = {}
) {
  const { id, relatedAssignables, ...assignableInstanceObj } = assignableInstance;

  if (_.keys(_.omit(assignableInstanceObj, updatableFields)).length) {
    throw new Error('Some of the provided keys are not updatable');
  }

  // EN: Validate the assignable instance properties
  // ES: Validar las propiedades del asignable instance
  validateAssignableInstance(assignableInstance);

  const { actions } = await getUserPermission(id, { userSession, transacting });

  if (!actions.includes('edit')) {
    throw new Error('You do not have permission to update this assignable instance');
  }

  // EN: Get the current existing assignable instance
  // ES: Obtener el asignable instance actual
  const { relatedAssignableInstances, ...currentAssignableInstance } =
    await getAssignableInstance.call(this, id, { details: true, userSession, transacting });

  const { object, diff } = getDiff(assignableInstanceObj, currentAssignableInstance);

  let changesDetected = false;

  if (diff.length) {
    changesDetected = true;
  }

  if (!changesDetected) {
    throw new Error('No changes detected');
  }

  // EN: Update dates
  // ES: Actualizar las fechas
  if (diff.includes('dates')) {
    await updateDates('assignableInstance', id, object.dates, { transacting });
  }

  // EN: Update the classes
  // ES: Actualizar las clases
  if (diff.includes('classes')) {
    await updateClasses(id, object.assignable.id, object.classes, { userSession, transacting });
  }

  // EN: Update the assignable instance
  // ES: Actualizar el asignable instance
  const cleanObj = _.pick(object, _.omit(diff, ['assignable', 'classes', 'dates']));

  if (diff.includes('relatedAssignableInstances')) {
    // TODO: What happens with relatedAssignables when unassigned?
    cleanObj.relatedAssignableInstances = JSON.stringify({
      before: _.uniq(
        await Promise.all(
          assignableInstance.relatedAssignableInstances?.before?.map((instance) =>
            createRelatedInstance.call(
              this,
              { instance, caller: id, type: 'before', propagate: propagateRelated },
              { userSession, transacting }
            )
          ) || []
        )
      ),
      after: _.uniq(
        await Promise.all(
          assignableInstance.relatedAssignableInstances?.after?.map((instance) =>
            createRelatedInstance.call(
              this,
              { instance, caller: id, type: 'after', propagate: propagateRelated },
              { userSession, transacting }
            )
          ) || []
        )
      ),
    });
  }

  if (diff.includes('metadata')) {
    cleanObj.metadata = JSON.stringify(cleanObj.metadata);
  }

  if (diff.includes('curriculum')) {
    cleanObj.curriculum = JSON.stringify(cleanObj.curriculum);
  }

  if (Object.keys(cleanObj).length) {
    await assignableInstances.update({ id }, cleanObj, { transacting });
  }

  // ----------

  const { assignable } = object;

  const oldInstance = {
    event: object.event,
  };
  const classes = _.map(await listAssignableInstanceClasses(id, { transacting }), 'class');
  const { dates } = object;

  const teachersIdsToRemove = [];
  const studentsIdsToRemove = [];
  const newTeacherIds = [];
  const newStudentIds = [];

  let { event } = oldInstance;

  const { calendar: calendarService } = leemons.getPlugin('calendar').services;

  try {
    if (event) {
      if (dates && dates.start && dates.deadline) {
        // ES: Si ya existe evento y seguimos teniendo fechas buenas actualizamos el evento
        await updateEvent(event, assignable, classes, { dates, transacting });
      } else {
        // ES: Si ya existe evento pero las nuevas fechas no cumplen los criterios tenemos que eliminar el evento
        await calendarService.removeEvent(event, { transacting });
        event = null;
      }
    } else if (dates && dates.start && dates.deadline) {
      // ES: Si no existe el evento y tenemos fechas buenas creamos el evento
      const newEvent = await registerEvent(assignable, classes, { dates, transacting });
      event = newEvent.id;
    }
  } catch (e) {
    leemons.log.error(`Error creating/updating event for assignable instance: ${e.message}`);
    // throw new Error(`Error updating event: ${e.message}`);
  }

  // ES: Eliminamos los profesores/estudiantes que ya no estan en el asignable
  if (event && (teachersIdsToRemove.length || studentsIdsToRemove.length)) {
    await leemons
      .getPlugin('calendar')
      .services.calendar.unGrantAccessUserAgentToEvent(
        event,
        [...teachersIdsToRemove, ...studentsIdsToRemove],
        {
          transacting,
        }
      );
  }

  // ES: Añadimos los nuevos profesores/estudiantes
  if (event && (newTeacherIds.length || newStudentIds.length)) {
    await leemons
      .getPlugin('calendar')
      .services.calendar.grantAccessUserAgentToEvent(
        event,
        [...newTeacherIds, ...newStudentIds],
        'view',
        {
          transacting,
        }
      );
  }

  return {
    id,
    ...object,
  };
}

module.exports = updateAssignableInstance;
