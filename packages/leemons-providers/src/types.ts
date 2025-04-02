import type { ActionSchema, Context } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';

export interface ProviderValue {
  pluginName: string;
  params: Record<string, any>;
}

export interface GetPluginProviderParams {
  keyValueModel: Model<GetKeyValueModel>;
  providerName: string;
}

export interface GetPluginProvidersParams {
  keyValueModel: Model<GetKeyValueModel>;
  raw?: boolean;
}

export interface GetModelParams {
  ctxKeyValueModelName: string;
  ctx: Context;
}

export interface GetProvidersActionsParams {
  ctxKeyValueModelName?: string;
}

export interface ProvidersActions {
  register: ActionSchema;
  unregister: ActionSchema;
}
