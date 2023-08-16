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
  { caller, relation, type, propagate = true },
  { userSession, transacting } = {}
) {
  const oppositeType = type === 'before' ? 'after' : 'before';

  // EN: Given instance is an id
  // ES: La instancia dada es un id
  if (relation.id) {
    const relatedInstance = await getAssignableInstance.call(this, relation.id, {
      userSession,
      transacting,
    });
    if (!relatedInstance) {
      throw new Error(`The related instance ${relation.id} does not exists`);
    }

    // EN: Update the relatedInstance to add the current instance as related
    // ES: Actualizar la instancia relacionada para añadir la instancia actual como relacionada
    if (propagate) {
      // eslint-disable-next-line no-use-before-define
      await updateAssignableInstance.call(
        this,
        {
          id: relation.id,
          relatedAssignableInstances: {
            ...relatedInstance.relatedAssignableInstances,
            [type]: relatedInstance.relatedAssignableInstances?.[type] || [],
            [oppositeType]: _.uniq([
              ...(relatedInstance.relatedAssignableInstances?.[oppositeType] || []),
              { ...relation, id: caller },
            ]),
          },
        },
        { userSession, transacting, propagateRelated: false }
      );
    }

    return relation;
  }

  // EN: Given instance is an object
  // ES: La instance dada es un objeto

  // eslint-disable-next-line no-use-before-define
  const createdInstance = await createAssignableInstance.call(
    this,
    {
      ...relation.instance,
      relatedAssignableInstances: {
        [type]: relation.instance.relatedAssignableInstances?.[type] || [],
        [oppositeType]: _.uniq([
          ...(relation.instance.relatedAssignableInstances?.[oppositeType] || []),
          caller.id,
        ]),
      },
    },
    {
      userSession,
      transacting,
    }
  );

  return { ..._.omit(relation, ['id', 'instance']), id: createdInstance.id };
}

async function updateEventAndAddToUsers({ assignable, event, dates, id }, { transacting }) {
  const classes = _.map(await listAssignableInstanceClasses(id, { transacting }), 'class');

  try {
    if (event) {
      await updateEvent(event, assignable, classes, { dates, transacting });
    }
    // TODO: Create the event and add it to the users. Needs: Users assigned and teachers
    //  else {
    //   const { id: eventId } = await registerEvent(assignable, classes, {
    //     dates,
    //     transacting,
    //   });
    //   newEvent = eventId;
    //   await leemons
    //     .getPlugin('calendar')
    //     .services.calendar.grantAccessUserAgentToEvent(
    //       event,
    //       [...newTeacherIds, ...newStudentIds],
    //       'view',
    //       {
    //         transacting,
    //       }
    //     );
    // }
  } catch (e) {
    leemons.log.error(`Error creating/updating event for assignable instance: ${e.message}`);
  }
}

async function updateAssignableInstance(
  assignableInstance,
  { userSession, transacting: t, propagateRelated } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
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
      const cleanObj = _.pick(object, _.without(diff, ['assignable', 'classes', 'dates']));

      if (diff.includes('relatedAssignableInstances')) {
        const before = await Promise.all(
          assignableInstance.relatedAssignableInstances?.before?.map((relation) =>
            createRelatedInstance.call(
              this,
              { relation, caller: id, type: 'before', propagate: propagateRelated },
              { userSession, transacting }
            )
          ) || []
        );

        const after = await Promise.all(
          assignableInstance.relatedAssignableInstances?.after?.map((relation) =>
            createRelatedInstance.call(
              this,
              { relation, caller: id, type: 'after', propagate: propagateRelated },
              { userSession, transacting }
            )
          ) || []
        );

        // TODO: What happens with relatedAssignables when unassigned?
        cleanObj.relatedAssignableInstances = JSON.stringify({
          before: _.uniq(before),
          after: _.uniq(after),
          blocking: _.uniq(assignableInstance.relatedAssignableInstances?.blocking),
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

      const { assignable, dates, event } = object;
      await updateEventAndAddToUsers({ assignable, dates, event, id }, { transacting });

      return {
        id,
        ...object,
      };
    },
    assignableInstances,
    t
  );
}

module.exports = updateAssignableInstance;
