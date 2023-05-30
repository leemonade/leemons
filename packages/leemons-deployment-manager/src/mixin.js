const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const { isCoreService } = require('./isCoreService');

module.exports = {
  name: '',
  actions: {
    leemonsDeploymentManagerEvent: {
      async handler(ctx) {
        if (!ctx.params?.event) throw new LeemonsError(ctx, { message: 'event param required' });
        if (this.events && this.events[ctx.params.event]) {
          // Comprobamos si el caller inicial tenia permiso a llamarnos
          await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
            fromService: ctx.params.caller || ctx.caller,
            toEvent: ctx.params.event,
            relationshipID: ctx.meta.relationshipID,
          });
          this.events[ctx.params.event](ctx.params.params, { parentCtx: ctx });
        }
        return null;
      },
    },
  },
  hooks: {
    before: {
      '*': [
        async function (ctx) {
          ctx.callerPlugin = getPluginNameFromServiceName(ctx.caller);
          ctx.meta.deploymentID = getDeploymentIDFromCTX(ctx);
          ctx.__leemonsDeploymentManagerCall = ctx.call;
          ctx.__leemonsDeploymentManagerEmit = ctx.emit;
          if (!isCoreService(ctx.caller) && !isCoreService(ctx.action.name)) {
            if (!ctx.meta.relationshipID)
              throw new LeemonsError(ctx, { message: 'relationshipID is required' });
            await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
              fromService: ctx.caller,
              toAction: ctx.action.name,
              relationshipID: ctx.meta.relationshipID,
            });
          }

          ctx.emit = function (event, params) {
            return ctx.__leemonsDeploymentManagerCall('deployment-manager.emit', { event, params });
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
        },
      ],
    },
  },
};
