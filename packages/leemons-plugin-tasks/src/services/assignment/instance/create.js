const emit = require('../../events/emit');
const { instances } = require('../../table');
const parseId = require('../../task/helpers/parseId');

module.exports = async function create(
  { task, deadline, available, executionTime = 0, message },
  { transacting } = {}
) {
  const { fullId, id } = await parseId(task, null, { transacting });

  const instance = await instances.create(
    {
      task: fullId,
      deadline: global.utils.sqlDatetime(deadline),
      available: global.utils.sqlDatetime(available),
      executionTime,
      message,
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
