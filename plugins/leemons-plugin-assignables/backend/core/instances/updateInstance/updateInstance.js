const { keys, omit, pick, uniq, without } = require('lodash');

const { LeemonsError } = require('leemons-error');

const { validateInstance } = require('../../helpers/validators/instance');
const { updateClasses } = require('../../classes/updateClasses');
const { updateDates } = require('../../dates/updateDates');
const { getUserPermission } = require('../../permissions/users/instances/getUserPermission');
const { getInstance } = require('../getInstance');

const { createRelatedInstance } = require('./createRelatedInstance');
const { updateEventAndAddToUsers } = require('./updateEventAndAddToUsers');

const { getDiff } = require('../../helpers/getDiff');

const updatableFields = [
  'alwaysAvailable',
  'dates',
  'duration',
  'gradable',
  'classes',
  'students',
  'messageToAssignees',
  'curriculum',
  'metadata',
  'addNewClassStudents',
  'showResults',
  'showCorrectAnsers',
  'relatedAssignableInstances',
];

async function updateInstance({ assignableInstance, propagateRelated, ctx }) {
  const { id, relatedAssignables, ...assignableInstanceObj } = assignableInstance;

  if (keys(omit(assignableInstanceObj, updatableFields)).length) {
    throw new LeemonsError(ctx, {
      message: 'Some of the provided keys are not updatable',
    });
  }

  // EN: Validate the assignable instance properties
  // ES: Validar las propiedades del asignable instance
  validateInstance({ assignable: assignableInstance });

  const { actions } = await getUserPermission({ assignableInstance: id, ctx });

  if (!actions.includes('edit')) {
    throw new LeemonsError(ctx, {
      message: 'You do not have permission to update this assignable instance',
    });
  }

  // EN: Get the current existing assignable instance
  // ES: Obtener el asignable instance actual
  const { relatedAssignableInstances, ...currentAssignableInstance } = await getInstance({
    id,
    details: true,
    ctx,
  });

  const { object, diff } = getDiff(assignableInstanceObj, currentAssignableInstance);

  let changesDetected = false;

  if (diff.length) {
    changesDetected = true;
  }

  if (!changesDetected) {
    throw new LeemonsError(ctx, {
      message: 'No changes detected',
    });
  }

  // EN: Update dates
  // ES: Actualizar las fechas
  if (diff.includes('dates')) {
    await updateDates({ type: 'assignableInstance', instance: id, dates: object.dates, ctx });
  }

  // EN: Update the classes
  // ES: Actualizar las clases
  if (diff.includes('classes')) {
    await updateClasses({
      instance: id,
      assignable: object.assignable.id,
      ids: object.classes,
      ctx,
    });
  }

  // EN: Update the assignable instance
  // ES: Actualizar el asignable instance
  const cleanObj = pick(object, without(diff, ['assignable', 'classes', 'dates']));

  if (diff.includes('relatedAssignableInstances')) {
    const before = await Promise.all(
      assignableInstance.relatedAssignableInstances?.before?.map((relation) =>
        createRelatedInstance({
          relation,
          caller: id,
          type: 'before',
          propagate: propagateRelated,
          ctx,
        })
      ) || []
    );

    const after = await Promise.all(
      assignableInstance.relatedAssignableInstances?.after?.map((relation) =>
        createRelatedInstance({
          relation,
          caller: id,
          type: 'after',
          propagate: propagateRelated,
          ctx,
        })
      ) || []
    );

    // TODO: What happens with relatedAssignables when unassigned?
    cleanObj.relatedAssignableInstances = {
      before: uniq(before),
      after: uniq(after),
      blocking: uniq(assignableInstance.relatedAssignableInstances?.blocking),
    };
  }

  // if (diff.includes('metadata')) {
  //   cleanObj.metadata = JSON.stringify(cleanObj.metadata);
  // }

  // if (diff.includes('curriculum')) {
  //   cleanObj.curriculum = JSON.stringify(cleanObj.curriculum);
  // }

  if (Object.keys(cleanObj).length) {
    await ctx.tx.db.Instances.updateOne({ id }, cleanObj);
  }

  const { assignable, dates, event } = object;
  await updateEventAndAddToUsers({ assignable, dates, event, id, ctx });

  return {
    id,
    ...object,
  };
}

module.exports = { updateInstance };
