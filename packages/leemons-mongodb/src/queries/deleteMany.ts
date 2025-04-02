import type { Context } from '@leemons/moleculer';
import { addTransactionState } from '@leemons/transactions';
import type { Document, FilterQuery, Model, QueryOptions, UpdateWriteOpResult } from 'mongoose';
import { addDeploymentIDToArrayOrObject } from './helpers/addDeploymentIDToArrayOrObject';
import { createTransactionIDIfNeed } from './helpers/createTransactionIDIfNeed';
import { increaseTransactionFinishedIfNeed } from './helpers/increaseTransactionFinishedIfNeed';
import { increaseTransactionPendingIfNeed } from './helpers/increaseTransactionPendingIfNeed';
import { updateMany } from './updateMany';

interface DeleteManyParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

interface LeemonsDeleteManyOptions<T> extends QueryOptions<T> {
  soft?: boolean;
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
}

export function deleteMany({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}: DeleteManyParams) {
  return async function <T extends Document>(
    _conditions: FilterQuery<T> = {},
    options: LeemonsDeleteManyOptions<T> = {}
  ): Promise<UpdateWriteOpResult | { deletedCount: number }> {
    if (options?.soft) {
      return updateMany({
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

      let oldItems: T[] = [];
      if (!ignoreTransaction && ctx.meta.transactionID) {
        oldItems = await model.find(conditions).lean();
      }

      const items = await model.deleteMany(conditions, options);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItems?.length) {
        await addTransactionState(ctx as any, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'createMany',
            data: oldItems,
          },
        });
      }

      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}
