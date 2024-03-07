const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

function modifyCTX(ctx, { forceLeemonsDeploymentManagerMixinNeedToBeImported }) {
  if (forceLeemonsDeploymentManagerMixinNeedToBeImported) {
    if (!ctx.meta.deploymentID || !ctx.callerPlugin || !ctx.__leemonsDeploymentManagerCall) {
      throw new LeemonsError(ctx, {
        message: 'LeemonsDeploymentManagerMixin need to be used',
      });
    }
  }
  ctx.socket = {
    emit: (ids, eventName, eventData) =>
      ctx.call('mqtt-aws-iot.socket.emit', { ids, eventName, eventData }),
    emitToAll: (eventName, eventData) =>
      ctx.call('mqtt-aws-iot.socket.emitToAll', { eventName, eventData }),
  };
}

const mixin = ({ forceLeemonsDeploymentManagerMixinNeedToBeImported = true } = {}) => ({
  name: '',

  hooks: {
    before: {
      '*': [
        async function (ctx) {
          modifyCTX(ctx, {
            forceLeemonsDeploymentManagerMixinNeedToBeImported,
          });
        },
      ],
    },
  },
  created() {
    _.forIn(this.events, (value, key) => {
      this.events[key] = async (params, opts, { afterModifyCTX, onError } = {}) =>
        value(params, opts, {
          onError,
          afterModifyCTX: async (ctx) => {
            modifyCTX(ctx, {
              forceLeemonsDeploymentManagerMixinNeedToBeImported,
            });
            if (_.isFunction(afterModifyCTX)) {
              await afterModifyCTX(ctx);
            }
          },
        });
    });
  },
});

module.exports = {
  mixin,
};
