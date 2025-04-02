import type { AnyContext } from '@leemons/moleculer';

export interface MQTTMixinOptions {
  forceLeemonsDeploymentManagerMixinNeedToBeImported?: boolean;
}

export interface EventHandlerOptions {
  afterModifyCTX?: (ctx: AnyContext) => Promise<void>;
  onError?: (error: Error) => void;
}
