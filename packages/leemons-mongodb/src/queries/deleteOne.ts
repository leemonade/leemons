import type { Context } from '@leemons/moleculer';
import { addTransactionState } from '@leemons/transactions';
import type { Document, FilterQuery, Model, QueryOptions, UpdateWriteOpResult } from 'mongoose';
import { addDeploymentIDToArrayOrObject } from './helpers/addDeploymentIDToArrayOrObject';
import { createTransactionIDIfNeed } from './helpers/createTransactionIDIfNeed';
import { increaseTransactionFinishedIfNeed } from './helpers/increaseTransactionFinishedIfNeed';
import { increaseTransactionPendingIfNeed } from './helpers/increaseTransactionPendingIfNeed';
import { updateOne } from './updateOne';

interface DeleteOneParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

interface LeemonsDeleteOneOptions<T> extends QueryOptions<T> {
  soft?: boolean;
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
}

export function deleteOne({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}: DeleteOneParams) {
  return async function <T extends Document>(
    _conditions: FilterQuery<T> = {},
    options: LeemonsDeleteOneOptions<T> = {}
  ): Promise<UpdateWriteOpResult | { deletedCount: number }> {
    if (options?.soft) {
      return updateOne({
        model,
        modelKey,
        autoDeploymentID,
        autoTransaction,
        autoRollback,
        ignoreTransaction,
        ctx,
      })(_conditions, { isDeleted: true, deletedAt: new Date() }, options);
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
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
      }

      let oldItem: T | null = null;
      if (!ignoreTransaction && ctx.meta.transactionID) {
        oldItem = await model.findOne(conditions).lean();
      }

      const item = await model.deleteOne(conditions, options);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx as any, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'createMany',
            data: [oldItem],
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}
