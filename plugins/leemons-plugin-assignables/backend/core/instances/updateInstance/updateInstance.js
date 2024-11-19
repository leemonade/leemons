const { LeemonsError } = require('@leemons/error');
const { keys, omit, pick, uniq, without, uniqBy } = require('lodash');

const { updateClasses } = require('../../classes/updateClasses');
const { updateDates } = require('../../dates/updateDates');
const { getDiff } = require('../../helpers/getDiff');
const { validateInstance } = require('../../helpers/validators/instance');
const { getUserPermission } = require('../../permissions/instances/users/getUserPermission');
const { getInstance } = require('../getInstance');

const { createRelatedInstance } = require('./createRelatedInstance');
const { updateEmailCron } = require('./helpers/updateEmailCron');
const { updateEventAndAddToUsers } = require('./updateEventAndAddToUsers');

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

/**
 * Update an assignable instance.
 *
 * @param {Object} options - The options for updating the assignable instance.
 * @param {Object} options.assignableInstance - The assignable instance object.
 * @param {boolean} options.propagateRelated - Flag indicating if related instances should be propagated.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @throws {LeemonsError} Throws an error if some of the provided keys are not updatable.
 * @throws {LeemonsError} Throws an error if the user does not have permission to update the assignable instance.
 * @throws {LeemonsError} Throws an error if no changes are detected.
 * @returns {Object} The updated assignable instance object.
 */
async function updateInstance({ assignableInstance, propagateRelated, onlyAddDates, ctx }) {
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
    await updateEmailCron({
      newInstance: assignableInstance,
      savedInstance: currentAssignableInstance,
      mergedInstance: object,
      ctx,
    });

    await updateDates({
      type: 'assignableInstance',
      instance: id,
      dates: object.dates,
      onlyAddDates,
      ctx,
    });
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
