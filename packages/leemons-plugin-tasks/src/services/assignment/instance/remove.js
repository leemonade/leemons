const emit = require('../../events/emit');
const { instances } = require('../../table');
const removeTeacher = require('../teacher/remove');

async function remove(task, instance, { transacting } = {}) {
  // EN: Before removing the instance, we need to delete the associated elements.
  // ES: Antes de eliminar la instancia, necesitamos eliminar los elementos asociados.

  // EN: Remove the teachers
  // ES: Eliminar los profesores
  await removeTeacher(instance, undefined, { transacting });
  const deleted = await instances.deleteMany(
    {
      id: instance,
    },
    {
      transacting,
    }
  );

  // EN: Remove the students
  // ES: Eliminar los estudiantes

  emit(['task.instance.deleted', `task.${task}.instance.${instance}.deleted`], {
    id: task,
    instance,
  });

  return deleted;
}

module.exports = async function removeAllInstancesOfTask(task, instance, { transacting } = {}) {
  if (instance) {
    return remove(task, instance, { transacting });
  }

  const associatedInstances = await instances.find(
    {
      task,
    },
    { transacting }
  );

  const deleted = await Promise.all(
    associatedInstances.map((i) => remove(task, i.id, { transacting }))
  );

  return {
    soft: false,
    deletedCount: deleted.length,
  };
};
