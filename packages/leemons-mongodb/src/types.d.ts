import { CreateOptions, QueryOptions, FilterQuery } from 'mongoose';

export { FilterQuery } from 'mongoose';

type LeemonsOptions = {
  disableAutoDeploy?: boolean;
  disableAutoLRN?: boolean;
};

export type CreateQuery<T> = (items: T, options: CreateOptions & LeemonsOptions) => Promise<T>;
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

export type Model<T> = {
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
};

export function newModel<T>(
  connection: Connection,
  modelName: string,
  schema: Schema<T, any, any> | Schema<T & Document, any, any>
): MongooseModel<T>;

export function LeemonsMongoDBMixin(options: any): any;

import { Schema, Connection, Model as MongooseModel } from 'mongoose';

export type NewModelFunction = (
  connection: Connection,
  modelName: string,
  schema: Schema
) => MongooseModel<any>;

export const mongoose: typeof import('mongoose');
export const newModel: NewModelFunction;

export type LeemonsSchema = {
  id: string;
  deploymentID: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
};

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
