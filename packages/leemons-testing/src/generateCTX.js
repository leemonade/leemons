const { modifyCTX } = require('@leemons/mongodb/src/mixin');

function generateCtx({
  actions,
  events,
  models,
  pluginName = 'leemons-testing',
  caller,
  autoDeploymentID = true,
  autoLRN = true,
}) {
  const actionHandler = async (actionName, props) => {
    if (actions.hasOwnProperty(actionName)) {
      return actions[actionName](props);
    }
    throw new Error(`The action ${actionName} was not mocked yet`);
  };

  const eventsHandler = async (eventName, props) => {
    if (events.hasOwnProperty(eventName)) {
      return events[eventName](props);
    }
    throw new Error(`The event ${eventName} was not mocked yet`);
  };

  const ctx = {
    call: actionHandler,
    emit: eventsHandler,
    tx: {
      call: actionHandler,
      emit: eventsHandler,
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
    logger: {
      info: (...args) => null,
      warn: (...args) => null,
      error: (...args) => null,
      log: (...args) => null,
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
