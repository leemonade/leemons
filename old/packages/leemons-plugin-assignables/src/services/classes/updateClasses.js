const _ = require('lodash');
const listAssignableInstanceClasses = require('./listAssignableInstanceClasses');
const registerClass = require('./registerClass');
const unregisterClass = require('./unregisterClass');

module.exports = async function updateClasses(
  assignableInstanceId,
  assignable,
  classIds,
  { transacting } = {}
) {
  // EN: Get the existing classes
  // ES: Obtener las clases existentes
  const existingClasses = _.map(
    await listAssignableInstanceClasses(assignableInstanceId, {
      transacting,
    }),
    (o) => _.get(o, 'class')
  );

  // EN: Get the classes to be added
  // ES: Obtener las clases a agregar
  const classesToAdd = _.difference(classIds, existingClasses);

  // EN: Get the classes to be removed
  // ES: Obtener las clases a remover
  const classesToRemove = _.difference(existingClasses, classIds);

  // EN: Remove the classes
  // ES: Eliminar las clases
  await unregisterClass(assignableInstanceId, classesToRemove, { transacting });

  // EN: Register the classes
  // ES: Registrar las clases
  await registerClass(assignableInstanceId, assignable, classesToAdd, { transacting });

  return {
    added: classesToAdd,
    removed: classesToRemove,
  };
};
