import type { AnyContext } from '@leemons/moleculer';
import type { Document, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { findOneAndUpdate } from './findOneAndUpdate';

interface FindByIdAndUpdateParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: AnyContext;
}

interface LeemonsFindByIdAndUpdateOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
  disableAutoLRN?: boolean;
  upsert?: boolean;
}

interface LeemonsDocument extends Document {
  id: string;
  deploymentID?: string;
  [key: string]: any;
}

export function findByIdAndUpdate({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: FindByIdAndUpdateParams) {
  return async function <T extends LeemonsDocument>(
    id: string,
    update: UpdateQuery<T>,
    options?: LeemonsFindByIdAndUpdateOptions<T>
  ): Promise<T | null> {
    return findOneAndUpdate({
      model,
      modelKey,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ignoreTransaction,
      ctx,
    })({ id }, update, options);
  };
}
