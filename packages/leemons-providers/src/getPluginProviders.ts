import _ from "lodash";
import type { GetPluginProvidersParams, ProviderValue } from "./types";

// Function overloads to specify return types based on raw parameter
export function getPluginProviders(
  params: Omit<GetPluginProvidersParams, "raw"> & { raw: true }
): Promise<ProviderValue[]>;
export function getPluginProviders(
  params: Omit<GetPluginProvidersParams, "raw"> & { raw: false }
): Promise<string[]>;
export function getPluginProviders(
  params: GetPluginProvidersParams
): Promise<string[] | ProviderValue[]>;

// Implementation
export async function getPluginProviders({
  keyValueModel,
  raw,
}: GetPluginProvidersParams): Promise<string[] | ProviderValue[]> {
  const registers = await keyValueModel.find({ key: "_providers_" }).lean();
  if (registers) {
    if (raw) {
      return _.map(registers, "value") as ProviderValue[];
    }
    return _.map(registers, "value.pluginName") as string[];
  }
  return [];
}
