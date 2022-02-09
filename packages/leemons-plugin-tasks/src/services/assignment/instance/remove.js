const emit = require('../../events/emit');
const { instances } = require('../../table');

module.exports = async function remove(task, instance, { transacting } = {}) {
  const deleted = await instances.deleteMany(
    {
      id: instance,
    },
    {
      transacting,
    }
  );

  emit(['task.instance.deleted', `task.${task}.instance.${instance}.deleted`], {
    id: task,
    instance,
  });

  return deleted;
};
