import { LeemonsError } from '@leemons/error';
import type { AnyContext, ServiceSchema } from '@leemons/moleculer';
import _ from 'lodash';
import type { EventHandlerOptions, MQTTMixinOptions } from './types';

function modifyCTX(
  ctx: AnyContext,
  { forceLeemonsDeploymentManagerMixinNeedToBeImported }: MQTTMixinOptions
): void {
  if (forceLeemonsDeploymentManagerMixinNeedToBeImported) {
    if (!ctx.meta.deploymentID || !ctx.callerPlugin || !ctx.__leemonsDeploymentManagerCall) {
      throw new LeemonsError(ctx, {
        message: 'LeemonsDeploymentManagerMixin need to be used',
      });
    }
  }
  ctx.socket = {
    emit: (ids: string | string[], eventName: string, eventData: any) =>
      ctx.call('mqtt-aws-iot.socket.emit', { ids, eventName, eventData }),
    emitToAll: (eventName: string, eventData: any) =>
      ctx.call('mqtt-aws-iot.socket.emitToAll', { eventName, eventData }),
  };
}

export const mixin = ({
  forceLeemonsDeploymentManagerMixinNeedToBeImported = true,
}: MQTTMixinOptions = {}): ServiceSchema => ({
  name: '',

  hooks: {
    before: {
      '*': [
        async function (ctx: AnyContext) {
          modifyCTX(ctx, {
            forceLeemonsDeploymentManagerMixinNeedToBeImported,
          });
        },
      ],
    },
  },

  created() {
    _.forIn(this.events, (value, key) => {
      this.events[key] = async (
        params: any,
        opts: any,
        { afterModifyCTX, onError }: EventHandlerOptions = {}
      ) =>
        value(params, opts, {
          onError,
          afterModifyCTX: async (ctx: AnyContext) => {
            modifyCTX(ctx, {
              forceLeemonsDeploymentManagerMixinNeedToBeImported,
            });
            if (_.isFunction(afterModifyCTX)) {
              await afterModifyCTX(ctx);
            }
          },
        });
    });
  },
});
