const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const { isCoreService } = require('./isCoreService');

module.exports = {
  name: '',
  hooks: {
    before: {
      '*': [
        async function (ctx) {
          ctx.meta.deploymentID = getDeploymentIDFromCTX(ctx);
          ctx.__leemonsDeploymentManagerCall = ctx.call;
          if (!isCoreService(ctx.caller) && !isCoreService(ctx.action.name)) {
            if (!ctx.meta.relationshipID)
              throw new LeemonsError(ctx, { message: 'relationshipID is required' });
            await ctx.__leemonsDeploymentManagerCall('deployment-manager.canCallMe', {
              fromService: ctx.caller,
              toAction: ctx.action.name,
              relationshipID: ctx.meta.relationshipID,
            });
          }

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
