const emit = require('../../events/emit');
const { instances } = require('../../table');
const parseId = require('../../task/helpers/parseId');

module.exports = async function create(task, { transacting = {} }) {
  const { fullId, id } = await parseId(task, null, { transacting });

  const instance = await instances.create(
    {
      task: fullId,
    },
    {
      transacting,
    }
  );

  emit(['task.instance.created', `task.${id}.instance.created`], {
    taskId: fullId,
    id: instance.id,
  });

  return instance.id;
};
