const { difference } = require('lodash');
const { listInstanceClasses } = require('./listInstanceClasses');
const { unregisterClass } = require('./unregisterClass');
const { registerClass } = require('./registerClass');

async function updateClasses({
  instance,
  assignable,
  ids,

  ctx,
}) {
  let existingClasses = await listInstanceClasses({ id: instance, ctx });
  existingClasses = existingClasses.map(({ class: id }) => id);

  const classesToRemove = difference(existingClasses, ids);
  const classesToAdd = difference(ids, existingClasses);

  if (classesToRemove.length) {
    await unregisterClass({ id: classesToRemove, instance, ctx });
  }
  if (classesToAdd.length) {
    await registerClass({ id: classesToAdd, instance, assignable, ctx });
  }

  return {
    added: classesToAdd,
    removed: classesToRemove,
  };
}

module.exports = {
  updateClasses,
};
