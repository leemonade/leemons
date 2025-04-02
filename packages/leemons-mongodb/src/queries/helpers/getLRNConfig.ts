import { getDeploymentIDFromCTX } from '@leemons/deployment-manager';
import type { Context } from '@leemons/moleculer';
import { getPluginNameFromCTX } from '@leemons/service-name-parser';
import { ObjectId } from 'mongodb';

interface GetLRNConfigParams {
  modelKey: string;
  ctx: Context;
}

interface LRNConfig {
  partition: string;
  pluginName: string;
  region: string;
  deploymentID: string;
  modelName: string;
  resourceID: ObjectId;
}

export function getLRNConfig({ modelKey, ctx }: GetLRNConfigParams): LRNConfig {
  return {
    partition: process.env.PARTITION || 'local',
    pluginName: getPluginNameFromCTX(ctx),
    region: process.env.REGION || 'local',
    deploymentID: getDeploymentIDFromCTX(ctx),
    modelName: modelKey,
    resourceID: new ObjectId(),
  };
}
