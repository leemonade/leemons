import type { Context } from '@leemons/moleculer';
import { countDocuments } from '../queries/countDocuments';
import { create } from '../queries/create';
import { deleteMany } from '../queries/deleteMany';
import { deleteOne } from '../queries/deleteOne';
import { find } from '../queries/find';
import { findById } from '../queries/findById';
import { findByIdAndDelete } from '../queries/findByIdAndDelete';
import { findByIdAndUpdate } from '../queries/findByIdAndUpdate';
import { findOne } from '../queries/findOne';
import { findOneAndDelete } from '../queries/findOneAndDelete';
import { findOneAndUpdate } from '../queries/findOneAndUpdate';
import { insertMany } from '../queries/insertMany';
import { save } from '../queries/save';
import { updateMany } from '../queries/updateMany';
import { updateOne } from '../queries/updateOne';
import { tracingWrapper } from './tracingWrapper';

interface ModelParams {
  model: any;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

export function getModelActions({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}: ModelParams): Record<string, any> {
  return {
    save: tracingWrapper(save, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    create: tracingWrapper(create, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    find: tracingWrapper(find, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findById: tracingWrapper(findById, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOne: tracingWrapper(findOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndDelete: tracingWrapper(findByIdAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndRemove: tracingWrapper(findByIdAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndDelete: tracingWrapper(findOneAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndRemove: tracingWrapper(findOneAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndUpdate: tracingWrapper(findByIdAndUpdate, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndUpdate: tracingWrapper(findOneAndUpdate, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndReplace: () => {
      throw new Error('findOneAndReplace not implemented');
    },
    updateOne: tracingWrapper(updateOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    updateMany: tracingWrapper(updateMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    deleteOne: tracingWrapper(deleteOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    deleteMany: tracingWrapper(deleteMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    countDocuments: tracingWrapper(countDocuments, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    insertMany: tracingWrapper(insertMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),

    aggregate: tracingWrapper(() => model.aggregate.bind(model), {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
  };
}
