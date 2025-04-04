import type { Context } from "@leemons/moleculer";
import type { Document, Model } from "mongoose";

interface SaveParams {
  model: Model<any>;
  autoDeploymentID?: boolean;
  autoRollback?: boolean;
  ctx: Context;
}

interface LeemonsDocument extends Document {
  id: string;
  deploymentID?: string;
  [key: string]: any;
}

export function save({
  model,
  autoDeploymentID,
  autoRollback,
  ctx,
}: SaveParams) {
  return async function <T extends LeemonsDocument>(item: T): Promise<T> {
    throw new Error("Not implemented yet");
  };
}
