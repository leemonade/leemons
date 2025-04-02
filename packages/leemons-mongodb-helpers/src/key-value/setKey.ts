import { Model } from '@leemons/mongodb';
import { GetKeyValueModel } from './getKeyValueModel';

export type SetKeyQueryResult = {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId?: string;
};

export async function setKey<T>(
  model: Model<GetKeyValueModel>,
  key: string,
  value?: T
): Promise<SetKeyQueryResult> {
  const toUpdate: Partial<GetKeyValueModel> = { key };
  if (typeof value !== 'undefined') {
    toUpdate.value = value;
  }
  const result = await model.updateOne({ key }, toUpdate, { upsert: true });
  return {
    acknowledged: result.acknowledged,
    modifiedCount: result.modifiedCount,
    upsertedId: result.upsertedId?.toString(),
  };
}
