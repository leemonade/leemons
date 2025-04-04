import type { Context, ServiceSchema } from "@leemons/moleculer";
import type { Connection, Schema } from "mongoose";
import mongoose from "mongoose";
import { type MixinOptions, mixin } from "./mixin/mixin";
import type { Model } from "./types";

export function newModel<T>(
  connection: Connection,
  modelName: string,
  schema: Schema<T>
): Model<T> {
  schema.add({
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  } as any);

  if (modelName in connection.models) {
    return connection.models[modelName] as unknown as Model<T>;
  }
  return connection.model(modelName, schema) as unknown as Model<T>;
}

export const leemonsSchemaFields = {
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  deploymentID: {
    type: String,
    required: true,
    index: true,
  },
} as const;

export function LeemonsMongoDBMixin(
  options?: MixinOptions
): Partial<ServiceSchema<Context>> {
  return mixin(options);
}

export { mongoose };
export * from "./types";
