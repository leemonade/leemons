import { generateLRN } from '@leemons/lrn';
import type { Context } from '@leemons/moleculer';
import { addTransactionState } from '@leemons/transactions';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import type { Document, FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { addDeploymentIDToArrayOrObject } from './helpers/addDeploymentIDToArrayOrObject';
import { createTransactionIDIfNeed } from './helpers/createTransactionIDIfNeed';
import { excludeDeleteIfNeedToQuery } from './helpers/excludeDeleteIfNeedToQuery';
import { getLRNConfig } from './helpers/getLRNConfig';
import { increaseTransactionFinishedIfNeed } from './helpers/increaseTransactionFinishedIfNeed';
import { increaseTransactionPendingIfNeed } from './helpers/increaseTransactionPendingIfNeed';

interface FindOneAndUpdateParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

interface LeemonsFindOneAndUpdateOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
  disableAutoLRN?: boolean;
  upsert?: boolean;
  new?: boolean;
}

interface LeemonsDocument extends Document {
  id: string;
  deploymentID?: string;
  [key: string]: any;
}

export function findOneAndUpdate({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: FindOneAndUpdateParams) {
  return async function <T extends LeemonsDocument>(
    _conditions: FilterQuery<T> = {},
    _update: UpdateQuery<T>,
    _options?: LeemonsFindOneAndUpdateOptions<T>
  ): Promise<T | null> {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });

    try {
      let conditions = _conditions;
      const options = _options || {};
      let update = _update;

      if (!('new' in options)) {
        options.new = true;
      }

      if (autoDeploymentID && !options?.disableAutoDeploy) {
        conditions = addDeploymentIDToArrayOrObject({
          items: conditions,
          ctx,
        }) as FilterQuery<T>;
        update = addDeploymentIDToArrayOrObject({
          items: update,
          ctx,
        }) as UpdateQuery<T>;
      }

      let oldItem: T | null = null;
      let rollbackAction = 'updateMany';

      if (options?.upsert) {
        options.new = true;
        if (autoLRN) {
          if (!_.isObject((update as any).$setOnInsert)) {
            (update as any).$setOnInsert = {};
          }
          (update as any).$setOnInsert.id = generateLRN({
            ...getLRNConfig({ modelKey, ctx }),
            resourceID: new ObjectId().toString(),
          });
        }
      }

      if (!ignoreTransaction && ctx.meta.transactionID && (options?.new || options?.upsert)) {
        oldItem = await excludeDeleteIfNeedToQuery(model.findOne(conditions).lean(), options);
      }

      const item = await excludeDeleteIfNeedToQuery(
        model.findOneAndUpdate(conditions, update, options),
        options
      );

      if (!oldItem && options?.upsert) {
        rollbackAction = 'removeMany';
        oldItem = item;
      }

      if (!options?.new) {
        oldItem = item;
      }

      if (!ignoreTransaction && ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx as any, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: rollbackAction,
            data: rollbackAction === 'removeMany' ? [oldItem.id] : [oldItem],
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}
