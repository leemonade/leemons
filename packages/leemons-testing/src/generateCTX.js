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
    meta: {},

    prefixPN: (str) => `${pluginName}.${str}`,
    callerPlugin: caller ?? undefined,
    logger: {
      log: (str) => console.log(str),
      warn: (str) => console.warn(str),
      error: (str) => console.error(str),
    },
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
