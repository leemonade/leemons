/* eslint-disable no-param-reassign */

async function assignTest({ id, data }, { userSession, transacting } = {}) {
  const { assignables: assignableService, assignableInstances: assignableInstancesService } =
    leemons.getPlugin('assignables').services;

  const assignable = await assignableService.getAssignable(id, {
    userSession,
    transacting,
  });

  if (!data.metadata?.questions) {
    data.metadata.questions = assignable.metadata?.questions;
  }

  return assignableInstancesService.createAssignableInstance(
    {
      assignable: assignable.id,
      ...data,
    },
    { userSession, transacting }
  );
}

module.exports = { assignTest };
