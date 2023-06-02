const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const { isCoreService } = require('./isCoreService');

function modifyCTX(ctx) {
  ctx.callerPlugin = getPluginNameFromServiceName(ctx.caller);
  ctx.meta.deploymentID = getDeploymentIDFromCTX(ctx);
  ctx.__leemonsDeploymentManagerCall = ctx.call;
  ctx.__leemonsDeploymentManagerEmit = ctx.emit;

  ctx.prefixPN = function (string) {
    return `${ctx.callerPlugin}.${string}`;
  };

  ctx.emit = function (event, params, opts) {
    return ctx.__leemonsDeploymentManagerCall(
      'deployment-manager.emit',
      {
        event: ctx.prefixPN(event),
        params,
      },
      opts
    );
  };

  ctx.call = async function (actionName, params, opts) {
    if (isCoreService(actionName)) {
      return ctx.__leemonsDeploymentManagerCall(actionName, params, opts);
    }
    const manager = await ctx.__leemonsDeploymentManagerCall(
      'deployment-manager.getGoodActionToCall',
      { actionName }
    );
    return ctx.__leemonsDeploymentManagerCall(manager.actionToCall, params, {
      ...opts,
      meta: {
        ...(opts?.meta || {}),
        relationshipID: manager.relationshipID,
      },
    });
  };
}

module.exports = {
  name: '',
  actions: {
    leemonsDeploymentManagerEvent: {
      async handler(ctx) {
        if (!ctx.params?.event) throw new LeemonsError(ctx, { message: 'event param required' });
        if (this.events && this.events[ctx.params.event]) {
          // Llamamos al evento el cual a sido machado por el nuestro en el created()
          return this.events[ctx.params.event](ctx.params.params, { parentCtx: ctx });
        }
        return null;
      },
    },
  },
  hooks: {
    before: {
      '*': [
        async function (ctx) {
          modifyCTX(ctx);

          // Si se esta intentando llamar al action leemonsDeploymentManagerEvent lo dejamos pasar
          // sin comprobar nada, ya que intenta lanzar un evento y los eventos tienen su propia seguridad
          if (!ctx.action.name.includes('leemonsDeploymentManagerEvent')) {
            if (!isCoreService(ctx.caller) && !isCoreService(ctx.action.name)) {
              if (!ctx.meta.relationshipID)
                throw new LeemonsError(ctx, { message: 'relationshipID is required' });
              await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
                fromService: ctx.caller,
                toAction: ctx.action.name,
                relationshipID: ctx.meta.relationshipID,
              });
            }
          }
        },
      ],
    },
  },
  created() {
    _.forIn(this.events, (value, key) => {
      const innerEvent = this._serviceSpecification.events[key];
      this.events[key] = async (params, opts, { afterModifyCTX }) => {
        // -- Init moleculer core code --
        let ctx;
        if (opts && opts.ctx) {
          // Reused context (in case of retry)
          ctx = opts.ctx;
        } else {
          const ep = {
            id: this.broker.nodeID,
            event: innerEvent,
          };
          ctx = this.broker.ContextFactory.create(this.broker, ep, params, opts || {});
        }
        ctx.eventName = key;
        ctx.eventType = 'emit';
        ctx.eventGroups = [innerEvent.group || this.name];

        // -- Finish moleculer core code --

        modifyCTX(ctx);

        if (_.isFunction(afterModifyCTX)) {
          afterModifyCTX(ctx);
        }

        await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
          fromService: getPluginNameFromServiceName(key),
          toEvent: key,
          relationshipID: ctx.meta.relationshipID,
        });

        return innerEvent.handler(ctx);
      };
    });
  },
};
