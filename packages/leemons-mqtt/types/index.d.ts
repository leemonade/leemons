import { ServiceSchema } from '@leemons/deployment-manager';

export function LeemonsMQTTMixin(): ServiceSchema;

export function LeemonsMQTTMixin({
  forceLeemonsDeploymentManagerMixinNeedToBeImported,
}: {
  forceLeemonsDeploymentManagerMixinNeedToBeImported: boolean;
}): ServiceSchema;
