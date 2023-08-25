const { modifyCTX } = require('leemons-mongodb/src/mixin');

function generateCtx({
  actions,
  models,
  pluginName = 'leemons-testing',
  caller,
  autoDeploymentID = true,
  autoLRN = true,
}) {
  const actionHandler = (actionName, props) => {
    if (actions.hasOwnProperty(actionName)) {
      return actions[actionName](props);
    }
    throw new Error(`The action ${actionName} was not mocked yet`);
  };

  const ctx = {
    call: actionHandler,
    tx: {
      call: actionHandler,
    },
    service: {
      name: pluginName,
    },
    meta: {
      userSession: {
        userAgents: [
          {
            id: 'userAgentId',
          },
        ],
      },
    },

    prefixPN: (str) => `${pluginName}.${str}`,
    callerPlugin: caller ?? undefined,
  };

  if (models) {
    modifyCTX(ctx, {
      autoDeploymentID,
      autoLRN,
      autoTransaction: false,
      autoRollback: false,
      forceLeemonsDeploymentManagerMixinNeedToBeImported: false,
      models,
    });
  }

  return ctx;
}

module.exports = { generateCtx };
