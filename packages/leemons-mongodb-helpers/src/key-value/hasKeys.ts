import type { Model } from "@leemons/mongodb";
import type { GetKeyValueModel } from "./getKeyValueModel";

export async function hasKeys(
  model: Model<GetKeyValueModel>,
  keys: string[]
): Promise<boolean> {
  const result = await model.countDocuments({ key: { $in: keys } });
  return result === keys.length;
}
