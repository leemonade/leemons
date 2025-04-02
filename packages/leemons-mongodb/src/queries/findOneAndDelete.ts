import type { Context } from '@leemons/moleculer';
import { addTransactionState } from '@leemons/transactions';
import type { Document, FilterQuery, Model, QueryOptions } from 'mongoose';
import { findOneAndUpdate } from './findOneAndUpdate';
import { addDeploymentIDToArrayOrObject } from './helpers/addDeploymentIDToArrayOrObject';
import { createTransactionIDIfNeed } from './helpers/createTransactionIDIfNeed';
import { increaseTransactionFinishedIfNeed } from './helpers/increaseTransactionFinishedIfNeed';
import { increaseTransactionPendingIfNeed } from './helpers/increaseTransactionPendingIfNeed';

interface FindOneAndDeleteParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

interface LeemonsFindOneAndDeleteOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
  soft?: boolean;
}

interface LeemonsDocument extends Document {
  id: string;
  deploymentID?: string;
  [key: string]: any;
}

export function findOneAndDelete({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}: FindOneAndDeleteParams) {
  return async function <T extends LeemonsDocument>(
    _conditions: FilterQuery<T> = {},
    options?: LeemonsFindOneAndDeleteOptions<T>
  ): Promise<T | null> {
    if (options?.soft) {
      return findOneAndUpdate({
        model,
        modelKey,
        autoDeploymentID,
        autoTransaction,
        autoRollback,
        ignoreTransaction,
        ctx,
      })(_conditions, { isDeleted: true, deletedAt: new Date() } as any, options);
    }

    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });

    try {
      let conditions = _conditions;
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx }) as FilterQuery<T>;
      }

      const item = await model.findOneAndDelete(conditions, options);

      if (!ignoreTransaction && ctx.meta.transactionID && item) {
        await addTransactionState(ctx as any, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'createMany',
            data: [item],
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}
