import _ from 'lodash';
import type { GetPluginProvidersParams, ProviderValue } from './types';

export async function getPluginProviders({
  keyValueModel,
  raw,
}: GetPluginProvidersParams): Promise<string[] | ProviderValue[]> {
  const registers = await keyValueModel.find({ key: '_providers_' }).lean();
  if (registers) {
    if (raw) {
      return _.map(registers, 'value') as ProviderValue[];
    }
    return _.map(registers, 'value.pluginName') as string[];
  }
  return [];
}
