/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, PaginatedQueryResult } from '@leemons/mongodb';
import { SortOrder } from 'mongoose';

type Params<M = Model<any>, R = object> = {
  model: M;
  page: number;
  size: number;
  query: FilterQuery<R>;
  columns?: string[];
  sort?: { [key: string]: SortOrder };
  options?: Parameters<M['find']>[2];
};

export function mongoDBPaginate<R = any, M = Model<any>>({
  model,
  page,
  size,
  query,
  columns,
  sort,
  options = {},
}: Params<M, R>): Promise<PaginatedQueryResult<R>>;

export const EMPTY_PAGINATED_RESULT: PaginatedQueryResult<any>;

export type GetKeyQueryResult<T> = T | undefined;
export type SetKeyQueryResult = {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId?: string;
};

export function getKey<T>(model: Model<T>, key: string): Promise<GetKeyQueryResult<T>>;
export function hasKey(model: Model<unknown>, key: string): Promise<boolean>;
export function setKey<T>(model: Model<T>, key: string, value?: T): Promise<SetKeyQueryResult>;

export type GetKeyValueModel = {
  id: string;
  deploymentID: string;
  key: string;
  value: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

export function getKeyValueModel({ modelName }: { modelName: string }): Model<GetKeyValueModel>;
