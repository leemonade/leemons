/* eslint-disable no-param-reassign */

async function assignDocument({ id, data }, { ctx, userSession, transacting } = {}) {
  const { assignableInstances: assignableInstancesService } =
    leemons.getPlugin('assignables').services;

  return assignableInstancesService.createAssignableInstance(
    {
      assignable: id,
      ...data,
    },
    { userSession, transacting, ctx }
  );
}

module.exports = assignDocument;
