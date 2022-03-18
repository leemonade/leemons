const emit = require('../../events/emit');
const { instances } = require('../../table');
const parseId = require('../../task/helpers/parseId');

module.exports = async function create(
  {
    task,
    startDate,
    deadline,
    visualizationDate = null,
    executionTime = 0,
    alwaysOpen = false,
    closeDate = null,
    message,
  },
  { transacting } = {}
) {
  const { fullId, id } = await parseId(task, null, { transacting });

  const instance = await instances.create(
    {
      task: fullId,
      startDate:
        startDate &&
        global.utils.sqlDatetime(startDate instanceof Date ? startDate : new Date(startDate)),
      deadline:
        deadline &&
        global.utils.sqlDatetime(deadline instanceof Date ? deadline : new Date(deadline)),
      visualizationDate:
        visualizationDate &&
        global.utils.sqlDatetime(
          visualizationDate instanceof Date ? visualizationDate : new Date(visualizationDate)
        ),
      alwaysOpen,
      closeDate:
        closeDate &&
        global.utils.sqlDatetime(closeDate instanceof Date ? closeDate : new Date(closeDate)),
      executionTime,
      message,
      status: 'assigned',
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
