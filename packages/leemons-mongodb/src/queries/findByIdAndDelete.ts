import type { Context } from "@leemons/moleculer";
import type { Document, Model, QueryOptions } from "mongoose";
import { findOneAndDelete } from "./findOneAndDelete";

interface FindByIdAndDeleteParams {
  model: Model<any>;
  modelKey: string;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  ignoreTransaction?: boolean;
  ctx: Context;
}

interface LeemonsFindByIdAndDeleteOptions<T> extends QueryOptions<T> {
  excludeDeleted?: boolean;
  disableAutoDeploy?: boolean;
  soft?: boolean;
}

interface LeemonsDocument extends Document {
  id: string;
  deploymentID?: string;
  [key: string]: any;
}

export function findByIdAndDelete({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}: FindByIdAndDeleteParams) {
  return async function <T extends LeemonsDocument>(
    id: string,
    options?: LeemonsFindByIdAndDeleteOptions<T>
  ): Promise<T | null> {
    return findOneAndDelete({
      model,
      modelKey,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ignoreTransaction,
      ctx,
    })({ id }, options);
  };
}
