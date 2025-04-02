import type { Context } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import { hasKey, setKey } from '@leemons/mongodb-helpers';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';
import _ from 'lodash';

interface Zone {
  key: string;
  name?: string;
  description?: string;
}

interface AddWidgetZonesDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  zones: Zone[];
  ctx: Context;
}

/**
 * Add widget zones to the database
 */
export async function addWidgetZonesDeploy({
  keyValueModel,
  zones,
  ctx,
}: AddWidgetZonesDeployParams): Promise<void> {
  if (
    !(await hasKey(keyValueModel, `widgets-zones`)) ||
    process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
  ) {
    await Promise.all(
      _.map(zones, (config) =>
        ctx.tx.call('widgets.widgets.setZone', {
          key: config.key,
          name: config.name,
          description: config.description,
        })
      )
    );
    await setKey(keyValueModel, `widgets-zones`);
  }
  ctx.tx.emit('init-widget-zones');
}
