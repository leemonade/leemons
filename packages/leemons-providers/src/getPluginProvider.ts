import type { GetPluginProviderParams, ProviderValue } from "./types";

export async function getPluginProvider({
  keyValueModel,
  providerName,
}: GetPluginProviderParams): Promise<ProviderValue | null> {
  return keyValueModel
    .findOne({ key: "_providers_", "value.pluginName": providerName })
    .lean();
}
