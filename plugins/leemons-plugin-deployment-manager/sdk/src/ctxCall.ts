import type { Context } from '@leemons/moleculer';
import _ from 'lodash';
import type { CallingOptions } from 'moleculer';
import { getDeploymentID } from './getDeploymentID';

interface ActionCallCacheItem {
  actionToCall: string;
  relationshipID: string;
}

interface ActionCallCache {
  [deploymentId: string]: {
    [actionKey: string]: ActionCallCacheItem;
  };
}

const actionCallCache: ActionCallCache = {};

interface CtxCallOptions {
  getDeploymentIdInCall?: boolean;
  dontGetDeploymentIDOnActionCall?: string[];
}

export async function ctxCall(
  ctx: Context,
  _actionName: string | { action: { name: string } },
  params: Record<string, any> | null = null,
  opts: CallingOptions | null = null,
  { getDeploymentIdInCall, dontGetDeploymentIDOnActionCall }: CtxCallOptions = {}
): Promise<any> {
  if (_.isObject(params) && Object.prototype.hasOwnProperty.call(params, 'ctx')) {
    delete (params as any).ctx;
  }

  const actionName = typeof _actionName === 'string' ? _actionName : _actionName.action.name;

  if (getDeploymentIdInCall && !dontGetDeploymentIDOnActionCall?.includes(actionName)) {
    await getDeploymentID(ctx);
  }

  if (
    actionName.startsWith('deployment-manager.') ||
    actionName.startsWith('gateway.') ||
    ctx.action?.name.startsWith('gateway.')
  ) {
    if (ctx.__leemonsDeploymentManagerCall) {
      return ctx.__leemonsDeploymentManagerCall(actionName, params, opts || undefined);
    }
    return ctx.call(actionName, params, opts || undefined);
  }

  if (!Object.prototype.hasOwnProperty.call(actionCallCache, ctx.meta.deploymentID)) {
    actionCallCache[ctx.meta.deploymentID] = {};
  }

  const cacheKey = `${ctx.service.fullName}.${actionName}`;

  let manager: ActionCallCacheItem;
  if (actionCallCache[ctx.meta.deploymentID][cacheKey]) {
    manager = actionCallCache[ctx.meta.deploymentID][cacheKey];
  } else {
    const hasTransaction = Boolean(ctx.meta.transactionID);
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

  if (process.env.DEBUG === 'true') {
    console.log(`CALL from "${ctx.action?.name || ctx.eventName}" to "${manager.actionToCall}"`);
  }

  try {
    const callOpts: CallingOptions = {
      ...opts,
      meta: {
        ...(opts?.meta || {}),
        relationshipID: manager.relationshipID,
      },
    };

    if (ctx.__leemonsDeploymentManagerCall) {
      return await ctx.__leemonsDeploymentManagerCall(manager.actionToCall, params, callOpts);
    }
    return await ctx.call(manager.actionToCall, params, callOpts);
  } catch (e) {
    delete ctx.meta.$statusCode;
    throw e;
  }
}
