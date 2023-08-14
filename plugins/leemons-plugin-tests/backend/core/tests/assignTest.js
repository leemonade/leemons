/* eslint-disable no-param-reassign */

const { table } = require('../tables');

async function assignTest({ id, data }, { ctx, userSession, transacting } = {}) {
  const { assignables: assignableService, assignableInstances: assignableInstancesService } =
    leemons.getPlugin('assignables').services;

  const assignable = await assignableService.getAssignable(id, {
    userSession,
    transacting,
  });

  if (!data.metadata?.questions) {
    data.metadata.questions = assignable.metadata?.questions;
  }

  if (data.metadata.filters.useAdvancedSettings) {
    if (data.metadata.filters.settings === 'new') {
      if (data.metadata.filters.presetName) {
        await table.assignSavedConfig.create(
          {
            config: JSON.stringify(data.metadata.filters),
            name: data.metadata.filters.presetName,
            userAgent: userSession.userAgents[0].id,
          },
          { transacting }
        );
      }
    } else {
      const config = await table.assignSavedConfig.findOne(
        { id: data.metadata.filters.settings },
        { transacting }
      );
      data.metadata.filters = JSON.parse(config.config);
    }
  }

  return assignableInstancesService.createAssignableInstance(
    {
      assignable: assignable.id,
      ...data,
    },
    { userSession, transacting, ctx }
  );
}

module.exports = { assignTest };
