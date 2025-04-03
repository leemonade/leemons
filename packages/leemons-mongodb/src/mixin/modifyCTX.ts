import { LeemonsError } from '@leemons/error';
import type { Context } from '@leemons/moleculer';
import _ from 'lodash';
import { createTransactionIDIfNeed } from '../queries/helpers/createTransactionIDIfNeed';
import { getDBModels } from './getDBModels';

interface ModifyCTXParams {
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  debugTransaction?: boolean;
  forceLeemonsDeploymentManagerMixinNeedToBeImported?: boolean;
  models: Record<string, any>;
}

export function modifyCTX(
  ctx: Context,
  {
    autoDeploymentID,
    autoTransaction,
    autoRollback,
    autoLRN,
    debugTransaction,
    forceLeemonsDeploymentManagerMixinNeedToBeImported,
    models,
  }: ModifyCTXParams
) {
  if (forceLeemonsDeploymentManagerMixinNeedToBeImported) {
    if (!ctx.meta.deploymentID || !ctx.callerPlugin || !ctx.__leemonsDeploymentManagerCall) {
      throw new LeemonsError(ctx, {
        message: 'LeemonsDeploymentManagerMixin need to be used',
      });
    }
  }
  ctx.__leemonsMongoDBCall = ctx.call;
  ctx.__leemonsMongoDBEmit = ctx.emit;
  ctx.db = getDBModels({
    models,
    autoTransaction,
    autoDeploymentID,
    autoRollback,
    autoLRN,
    ignoreTransaction: true,
    ctx,
  });
  ctx.call = (...args: any[]) => {
    let [actionName, params, opts] = args;

    if (!_.isObject(opts)) {
      opts = {};
    }

    if (!_.isObject(opts.meta)) {
      opts.meta = {};
    }

    opts.meta.transactionID = null;
    return ctx.__leemonsMongoDBCall(actionName, params, opts);
  };
  ctx.emit = (...args: any[]) => {
    const [event, params] = args;

    return ctx.__leemonsMongoDBEmit(event, params, { meta: { transactionID: null } });
  };

  ctx.tx = {
    emit: async (...args: any[]) => {
      const [event, params] = args;

      await createTransactionIDIfNeed({ autoTransaction, ctx });
      return ctx.__leemonsMongoDBEmit(event, params);
    },
    call: async (...args: any[]) => {
      const [actionName, params, opts] = args;

      if (!opts?.meta?.__isInternalCall) {
        await createTransactionIDIfNeed({ autoTransaction, ctx });
      } else if (debugTransaction && actionName.startsWith('transactions.')) {
        console.debug(
          `[MongoDB Transactions] (Call) - ${actionName.replace('transactions.', '')}`,
          params,
          opts
        );
      }
      return ctx.__leemonsMongoDBCall(actionName, params, opts);
    },
    db: getDBModels({
      models,
      autoTransaction,
      autoDeploymentID,
      autoRollback,
      autoLRN,
      ignoreTransaction: false,
      ctx,
    }),
  };
}
