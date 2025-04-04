import { generateLRN } from "@leemons/lrn";
import type { Context } from "@leemons/moleculer";
import _ from "lodash";
import { ObjectId } from "mongodb";
import { getLRNConfig } from "./getLRNConfig";

export interface WithId {
  id?: string;
  [key: string]: any;
}

interface AddLRNToIdParams {
  items: WithId | WithId[];
  modelKey: string;
  ctx: Context;
}

export function addLRNToIdToArrayOrObject({
  items: _items,
  modelKey,
  ctx,
}: AddLRNToIdParams): WithId | WithId[] {
  const items = _.cloneDeep(_items);
  const config = getLRNConfig({ modelKey, ctx });
  if (_.isArray(items)) {
    return _.map(items, (item) => {
      // eslint-disable-next-line no-param-reassign
      item.id =
        item.id ??
        generateLRN({ ...config, resourceID: new ObjectId().toString() });
      return item;
    });
  }
  items.id =
    items.id ??
    generateLRN({ ...config, resourceID: new ObjectId().toString() });
  return items;
}
