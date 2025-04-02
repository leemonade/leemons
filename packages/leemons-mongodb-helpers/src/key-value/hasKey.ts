import { Model } from '@leemons/mongodb';
import { GetKeyValueModel } from './getKeyValueModel';

export async function hasKey(model: Model<GetKeyValueModel>, key: string): Promise<boolean> {
  const result = await model.countDocuments({ key });
  return !!result;
}
