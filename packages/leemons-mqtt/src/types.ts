import type { Context } from '@leemons/moleculer';

export interface MQTTMixinOptions {
  forceLeemonsDeploymentManagerMixinNeedToBeImported?: boolean;
}

export interface EventHandlerOptions {
  afterModifyCTX?: (ctx: Context) => Promise<void>;
  onError?: (error: Error) => void;
}
