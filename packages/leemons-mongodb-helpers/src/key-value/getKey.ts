import { Model } from '@leemons/mongodb';
import { GetKeyValueModel } from './getKeyValueModel';

export type GetKeyQueryResult<T> = T | undefined;

export async function getKey<T>(
  model: Model<GetKeyValueModel>,
  key: string
): Promise<GetKeyQueryResult<T>> {
  const result = await model.findOne({ key });
  return result?.value as T | undefined;
}
