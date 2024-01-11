const _ = require('lodash');
const { getDeploymentID } = require('./getDeploymentID');

const actionCallCache = {};

async function ctxCall(
  ctx,
  _actionName,
  params = null,
  opts = null,
  { getDeploymentIdInCall, dontGetDeploymentIDOnActionCall } = {}
) {
  if (_.isObject(params) && params.hasOwnProperty('ctx')) {
    delete params.ctx;
  }

  let actionName = _actionName;
  if (_.isObject(actionName)) {
    actionName = actionName.action.name;
  }

  if (getDeploymentIdInCall && !dontGetDeploymentIDOnActionCall.includes(actionName)) {
    await getDeploymentID(ctx);
  }

  if (
    actionName.startsWith('deployment-manager.') ||
    actionName.startsWith('gateway.') ||
    ctx.action?.name.startsWith('gateway.')
  ) {
    if (ctx.__leemonsDeploymentManagerCall) {
      return ctx.__leemonsDeploymentManagerCall(actionName, params, opts);
    }
    return ctx.call(actionName, params, opts);
  }

  if (!Object.prototype.hasOwnProperty.call(actionCallCache, ctx.meta.deploymentID)) {
    actionCallCache[ctx.meta.deploymentID] = {};
  }

  const cacheKey = `${ctx.service.fullName}.${actionName}`;

  let manager = null;
  if (actionCallCache[ctx.meta.deploymentID][cacheKey]) {
    manager = actionCallCache[ctx.meta.deploymentID][cacheKey];
  } else {
    let hasTransaction = false;
    if (ctx.meta.transactionID) hasTransaction = true;
    if (ctx.__leemonsDeploymentManagerCall) {
      manager = await ctx.__leemonsDeploymentManagerCall('deployment-manager.getGoodActionToCall', {
        actionName,
      });
    } else {
      manager = await ctx.call('deployment-manager.getGoodActionToCall', {
        actionName,
      });
    }
    if (ctx.meta.transactionID && !hasTransaction) {
      delete ctx.meta.transactionID;
    }
    actionCallCache[ctx.meta.deploymentID][cacheKey] = manager;
  }

  if (process.env.DEBUG === 'true')
    console.log(`CALL from "${ctx.action?.name || ctx.event?.name}" to "${manager.actionToCall}"`);

  try {
    if (ctx.__leemonsDeploymentManagerCall) {
      return await ctx.__leemonsDeploymentManagerCall(manager.actionToCall, params, {
        ...opts,
        meta: {
          ...(opts?.meta || {}),
          relationshipID: manager.relationshipID,
        },
      });
    }
    return await ctx.call(manager.actionToCall, params, {
      ...opts,
      meta: {
        ...(opts?.meta || {}),
        relationshipID: manager.relationshipID,
      },
    });
  } catch (e) {
    delete ctx.meta.$statusCode;
    throw e;
  }
}

module.exports = { ctxCall };
