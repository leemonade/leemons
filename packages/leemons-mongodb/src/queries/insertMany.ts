import type { Context } from '@leemons/moleculer';
import { addTransactionState } from '@leemons/transactions';
import _ from 'lodash';
import type { Document, InsertManyOptions, Model } from 'mongoose';
import { addDeploymentIDToArrayOrObject } from './helpers/addDeploymentIDToArrayOrObject';
import { addLRNToIdToArrayOrObject } from './helpers/addLRNToIdToArrayOrObject';
import { createTransactionIDIfNeed } from './helpers/createTransactionIDIfNeed';
import { increaseTransactionFinishedIfNeed } from './helpers/increaseTransactionFinishedIfNeed';
import { increaseTransactionPendingIfNeed } from './helpers/increaseTransactionPendingIfNeed';

interface InsertManyParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

interface LeemonsInsertManyOptions<T> extends InsertManyOptions {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
}

interface WithDeploymentID {
  deploymentID?: string;
  [key: string]: any;
}

interface WithId {
  id: string;
  [key: string]: any;
}

interface LeemonsDocument extends Document {
  id: string;
  deploymentID?: string;
  [key: string]: any;
}

export function insertMany({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: InsertManyParams) {
  return async function <T extends LeemonsDocument>(
    toAdd: Partial<T>[],
    options?: LeemonsInsertManyOptions<T>
  ): Promise<T[]> {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });

    try {
      let toCreate = toAdd;
      if (autoDeploymentID) {
        toCreate = addDeploymentIDToArrayOrObject({ items: toCreate, ctx }) as Partial<T>[];
      }
      if (autoLRN) {
        toCreate = addLRNToIdToArrayOrObject({ items: toCreate, modelKey, ctx }) as Partial<T>[];
      }

      let items: T[] = [];
      try {
        const result = await model.insertMany(toCreate, options || {});
        items = (Array.isArray(result) ? result : [result]) as T[];
      } catch (e: any) {
        if (e.insertedDocs) {
          items = (Array.isArray(e.insertedDocs) ? e.insertedDocs : [e.insertedDocs]) as T[];
        }
        throw e;
      } finally {
        if (!ignoreTransaction && ctx.meta.transactionID && items.length) {
          await addTransactionState(ctx as any, {
            action: 'leemonsMongoDBRollback',
            payload: {
              modelKey,
              action: 'removeMany',
              data: _.map(items, (item) => item.id),
            },
          });
        }
      }

      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}
