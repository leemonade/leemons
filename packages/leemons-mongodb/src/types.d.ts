import type { ServiceSchema } from '@leemons/deployment-manager';
import { Connection, HydratedDocumentFromSchema, Model as MongooseModel, Schema } from 'mongoose';

type LeemonsOptions = {
  disableAutoDeploy?: boolean;
  disableAutoLRN?: boolean;
};

export type LeemonsSchema = {
  id: string;
  deploymentID: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
};

export type CreateQuery<T> = (
  items: Partial<T> & Pick<T, Exclude<keyof T, keyof LeemonsSchema>>,
  options?: CreateOptions & LeemonsOptions
) => HydratedDocumentFromSchema<T> & T;
export type FindQuery<T> = MongooseModel<T>['find'];
export type FindByIdQuery<T> = MongooseModel<T>['findById'];
export type FindOneQuery<T> = MongooseModel<T>['findOne'];
export type FindByIdAndDeleteQuery<T> = MongooseModel<T>['findByIdAndDelete'];
export type FindOneAndDeleteQuery<T> = MongooseModel<T>['findOneAndDelete'];
export type FindByIdAndUpdateQuery<T> = MongooseModel<T>['findByIdAndUpdate'];
export type FindOneAndUpdateQuery<T> = MongooseModel<T>['findOneAndUpdate'];
export type UpdateOneQuery<T> = MongooseModel<T>['updateOne'];
export type UpdateManyQuery<T> = MongooseModel<T>['updateMany'];
export type DeleteOneQuery<T> = MongooseModel<T>['deleteOne'];
export type DeleteManyQuery<T> = MongooseModel<T>['deleteMany'];
export type CountDocumentsQuery<T> = MongooseModel<T>['countDocuments'];
export type InsertManyQuery<T> = MongooseModel<T>['insertMany'];
export type AggregateQuery<T> = MongooseModel<T>['aggregate'];

export interface Model<T> {
  create: CreateQuery<T>;
  find: FindQuery<T>;
  findById: FindByIdQuery<T>;
  findOne: FindOneQuery<T>;
  findByIdAndDelete: FindByIdAndDeleteQuery<T>;
  findByIdAndRemove: FindByIdAndDeleteQuery<T>;
  findOneAndDelete: FindOneAndDeleteQuery<T>;
  findOneAndRemove: FindOneAndDeleteQuery<T>;
  findByIdAndUpdate: FindByIdAndUpdateQuery<T>;
  findOneAndUpdate: FindOneAndUpdateQuery<T>;
  updateOne: UpdateOneQuery<T>;
  updateMany: UpdateManyQuery<T>;
  deleteOne: DeleteOneQuery<T>;
  deleteMany: DeleteManyQuery<T>;
  countDocuments: CountDocumentsQuery<T>;
  insertMany: InsertManyQuery<T>;
  aggregate: AggregateQuery<T>;
}

export function newModel<T>(
  connection: Connection,
  modelName: string,
  schema: Schema<T, any, any> | Schema<T & Document, any, any>
): Model<T>;

type MixinOptions = {
  waitToRollbackFinishOnError?: boolean;
  autoDeploymentID?: boolean;
  autoTransaction?: boolean;
  autoRollback?: boolean;
  autoLRN?: boolean;
  debugTransaction?: boolean;
  forceLeemonsDeploymentManagerMixinNeedToBeImported?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  models?: Record<string, Model<any>>;
};

export const mongoose: typeof import('mongoose');

export function LeemonsMongoDBMixin(options?: MixinOptions): Partial<ServiceSchema>;

export type PaginatedQueryResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalPages: number;
  totalCount: number;
  count: number;
  nextPage: number | null;
  prevPage: number | null;
  canGoPrevPage: boolean;
  canGoNextPage: boolean;
};

export type PipelineStage = import('mongoose').PipelineStage;

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
