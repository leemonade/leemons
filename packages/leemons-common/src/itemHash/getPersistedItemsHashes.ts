import type { Model } from "@leemons/mongodb";
import { get } from "lodash";
import { getItemHashKey } from "./getItemHashKey";
import type { HashPerItem } from "./getItemsHashByKey";

interface GetPersistedItemsHashesParams {
  KeyValuesModel: Model<any>;
  hashPerItem: HashPerItem;
  documentKey?: string;
}

interface PersistedItems {
  [key: string]: boolean | string;
}

/**
 * Checks if the hashes for the given template are already saved in the database.
 *
 * @example
 * // Example of hashPerItem input
 * const hashPerItem = {
 *   item1: "hash1",
 *   item2: "hash2",
 *   item3: "hash3"
 * };
 *
 * // Assuming the function is called with the above hashPerItem and appropriate KeyValuesModel
 * getPersistedItemsHashes({ KeyValuesModel, hashPerItem, documentKey: 'exampleKey' }).then(result => {
 *   console.log(result);
 *   // Output might look like this:
 *   // {
 *   //   item1: "persistedHash1",
 *   //   item2: false,
 *   //   item3: "persistedHash3"
 *   // }
 * });
 */
export async function getPersistedItemsHashes({
  KeyValuesModel,
  hashPerItem,
  documentKey = "default",
}: GetPersistedItemsHashesParams): Promise<PersistedItems> {
  const itemKeys = Object.keys(hashPerItem);
  const keys = itemKeys.map((key) =>
    getItemHashKey({ key, hash: hashPerItem[key] })
  );

  const persistedHashes =
    (await KeyValuesModel.findOne({
      key: documentKey,
    })
      .select(keys)
      .lean()) ?? {};

  const persistedItems: PersistedItems = {};

  itemKeys.forEach((key, i) => {
    persistedItems[key] = get(persistedHashes, keys[i], false);
  });

  return persistedItems;
}
