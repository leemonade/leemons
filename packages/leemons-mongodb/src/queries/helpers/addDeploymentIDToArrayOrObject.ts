import { getDeploymentIDFromCTX } from "@leemons/deployment-manager";
import type { Context } from "@leemons/moleculer";
import _ from "lodash";

export interface WithDeploymentID {
  deploymentID?: string;
  [key: string]: any;
}

interface AddDeploymentIDParams {
  items: WithDeploymentID | WithDeploymentID[];
  ctx: Context;
}

export function addDeploymentIDToArrayOrObject({
  items: _items,
  ctx,
}: AddDeploymentIDParams): WithDeploymentID | WithDeploymentID[] {
  const items = _.cloneDeep(_items);
  if (_.isArray(items)) {
    return _.map(items, (item) => {
      item.deploymentID = getDeploymentIDFromCTX(ctx);
      return item;
    });
  }
  items.deploymentID = getDeploymentIDFromCTX(ctx);
  return items;
}
