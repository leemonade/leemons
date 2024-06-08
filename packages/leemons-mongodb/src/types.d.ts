import { CreateOptions, FilterQuery, QueryOptions } from "mongoose";

type LeemonsOptions = {
  disableAutoDeploy?: boolean;
  disableAutoLRN?: boolean;
}

export type CreateQuery = (items: any, options: CreateOptions & LeemonsOptions) => Promise<any>;
export type FindQuery = import('mongoose').Model<any>['find'];
export type FindByIdQuery = import('mongoose').Model<any>['findById'];
export type FindOneQuery = import('mongoose').Model<any>['findOne'];
export type FindByIdAndDeleteQuery = import('mongoose').Model<any>['findByIdAndDelete'];
export type FindOneAndDeleteQuery = import('mongoose').Model<any>['findOneAndDelete'];
export type FindByIdAndUpdateQuery = import('mongoose').Model<any>['findByIdAndUpdate'];
export type FindOneAndUpdateQuery = import('mongoose').Model<any>['findOneAndUpdate'];
export type UpdateOneQuery = import('mongoose').Model<any>['updateOne'];
export type UpdateManyQuery = import('mongoose').Model<any>['updateMany'];
export type DeleteOneQuery = import('mongoose').Model<any>['deleteOne'];
export type DeleteManyQuery = import('mongoose').Model<any>['deleteMany'];
export type CountDocumentsQuery = import('mongoose').Model<any>['countDocuments'];
export type InsertManyQuery = import('mongoose').Model<any>['insertMany'];
export type AggregateQuery = import('mongoose').Model<any>['aggregate'];


export type Model = {
  create: CreateQuery;
  find: FindQuery;
  findById: FindByIdQuery;
  findOne: FindOneQuery;
  findByIdAndDelete: FindByIdAndDeleteQuery;
  findByIdAndRemove: FindByIdAndDeleteQuery;
  findOneAndDelete: FindOneAndDeleteQuery;
  findOneAndRemove: FindOneAndDeleteQuery;
  findByIdAndUpdate: FindByIdAndUpdateQuery;
  findOneAndUpdate: FindOneAndUpdateQuery;
  updateOne: UpdateOneQuery;
  updateMany: UpdateManyQuery;
  deleteOne: DeleteOneQuery;
  deleteMany: DeleteManyQuery;
  countDocuments: CountDocumentsQuery;
  insertMany: InsertManyQuery;
  aggregate: AggregateQuery;
};
