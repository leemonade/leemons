const emit = require('../../events/emit');
const assignablesServices = require('../../assignables');

module.exports = async function create(
  { task, ...instanceData },
  { userSession, transacting, ctx } = {}
) {
  const { assignableInstances } = assignablesServices();

  const createdInstance = await assignableInstances.createAssignableInstance(
    {
      ...instanceData,
      assignable: task,
    },
    { userSession, transacting, ctx }
  );

  // emit(['task.instance.created', `task.${id}.instance.created`], {
  //   taskId: fullId,
  //   id: instance.id,
  // });

  return createdInstance;
};
