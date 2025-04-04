import { sha1 } from "object-hash";

/**
 * An object mapping each item to its corresponding hash.
 * @example
 * // Example of a HashPerItem object
 * const hashPerItemExample = {
 *   item1: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
 *   item2: "da39a3ee5e6b4b0d3255bfef95601890afd80709"
 * };
 */
export type HashPerItem = {
  [key: string]: string;
};

interface GetItemsHashByKeyParams {
  items: {
    [itemKey: string]: any;
  };
}

/**
 * Generates a hash for each Item in the provided object.
 *
 * This function takes an object containing items,
 * computes a SHA1 hash for the content of each item, and returns an object
 * mapping each item to its corresponding hash.
 */
export function getItemsHashByKey({
  items,
}: GetItemsHashByKeyParams): HashPerItem {
  const itemKeys = Object.keys(items);
  const hashPerItem: HashPerItem = {};

  itemKeys.forEach((itemKey) => {
    hashPerItem[itemKey] = sha1(items[itemKey]);
  });

  return hashPerItem;
}
