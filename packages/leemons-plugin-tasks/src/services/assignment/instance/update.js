const emit = require('../../events/emit');
const { instances } = require('../../table');
const { get: getInstance } = require('./get');

module.exports = async function update(
  {
    instance: instanceId,
    startDate,
    deadline,
    visualizationDate = null,
    executionTime = 0,
    alwaysOpen = false,
    closeDate = null,
    message,
    status,
    showCurriculum,
  },
  { transacting } = {}
) {
  const instanceExists = await getInstance(instanceId, { columns: ['id'], transacting });

  if (!instanceExists) {
    throw new Error(`Instance ${instanceId} does not exist`);
  }

  const instance = await instances.update(
    {
      id: instanceId,
    },
    {
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
      status,
      showCurriculum: showCurriculum && JSON.stringify(showCurriculum),
    },
    {
      transacting,
    }
  );

  emit(['task.instance.updated', `task.instance.${instance}.updated`], {
    id: instance.id,
  });

  return instance;
};
