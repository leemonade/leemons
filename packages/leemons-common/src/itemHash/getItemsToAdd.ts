import type { Model } from "@leemons/mongodb";
import type { HashPerItem } from "./getItemsHashByKey";
import { getPersistedItemsHashes } from "./getPersistedItemsHashes";

interface GetItemsToAddParams {
  hashPerItem: HashPerItem;
  KeyValuesModel: Model<any>;
  documentKey: string;
  forceReload?: boolean;
}

/**
 * Determines which items need to be added based on the provided hash per item.
 *
 * @example
 * // Suppose getPersistedItemsHashes returns:
 * // {
 * //   "item1": true, // This item is already present
 * //   "item2": false, // This item needs to be added
 * //   "item3": true, // This item is already present
 * //   "item4": false, // This item needs to be added
 * // }
 * // Then, getItemsToAdd would return:
 * getItemsToAdd({
 *   hashPerItem: { item1: 'hash1', item2: 'hash2', item3: 'hash3', item4: 'hash4' },
 *   KeyValuesModel: YourMongooseModel,
 *   documentKey: 'yourDocumentKey'
 * });
 * // Expected output: ["item2", "item4"]
 */
export async function getItemsToAdd({
  hashPerItem,
  KeyValuesModel,
  documentKey,
  forceReload,
}: GetItemsToAddParams): Promise<string[]> {
  const persistedItems = await getPersistedItemsHashes({
    KeyValuesModel,
    hashPerItem,
    documentKey,
  });

  return Object.entries(persistedItems)
    .filter(([, saved]) => forceReload || !saved)
    .map(([itemKey]) => itemKey);
}
