const _ = require('lodash');
const getDiff = require('../../helpers/getDiff');
const { validateAssignableInstance } = require('../../helpers/validators/assignableInstance');
const updateClasses = require('../classes/updateClasses');
const updateDates = require('../dates/updateDates');
const { assignableInstances } = require('../tables');
const getAssignableInstance = require('./getAssignableInstance');
const getUserPermission = require('./permissions/assignableInstance/users/getUserPermission');

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
];

module.exports = async function updateAssignableInstance(
  assignableInstance,
  { userSession, transacting } = {}
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

  // TODO: What happens with relatedAssignables?
  // EN: Update related assignable instances
  // ES: Actualizar asignable instances relacionadas
  // if (relatedAssignables) {
  //   const updated = await Promise.all(
  //     relatedAssignableInstances
  //       .map((a) => ({ id: a.id, ...relatedAssignables[a.id] }))
  //       .filter((a) => a)
  //       .map(({ a }) =>
  //         updateAssignableInstance(
  //           { ...a, ...assignableInstanceObj, relatedAssignables },
  //           { userSession, transacting }
  //         )
  //       )
  //   );

  //   if (updated.length) {
  //     changesDetected = true;
  //   }
  // }
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

  if (diff.includes('metadata')) {
    cleanObj.metadata = JSON.stringify(cleanObj.metadata);
  }

  if (diff.includes('curriculum')) {
    cleanObj.curriculum = JSON.stringify(cleanObj.curriculum);
  }

  if (cleanObj.length) {
    await assignableInstances.update({ id }, cleanObj, { transacting });
  }

  return {
    id,
    ...object,
  };
};
