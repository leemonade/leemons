import { LeemonsError } from '@leemons/error';
import type { AnyContext } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import { hasKey, setKey } from '@leemons/mongodb-helpers';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';
import type { Profile } from '@leemons/users';
import _ from 'lodash';

interface WidgetItemConfig {
  zoneKey: string;
  key: string;
  url: string;
  name: string;
  description: string;
  properties: Record<string, any>;
  path?: string;
  profiles?: string[];
}

interface ProfilesResponse {
  items: Profile[];
}

interface SetItemToZoneParams {
  config: WidgetItemConfig;
  ctx: AnyContext;
  profilesBySysName: Record<string, Profile>;
}

interface AddWidgetItemsDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  items: WidgetItemConfig[];
  ctx: AnyContext;
}

/**
 * Set an item to a zone
 */
async function setItemToZone({
  config,
  ctx,
  profilesBySysName,
}: SetItemToZoneParams): Promise<any> {
  const data: WidgetItemConfig = {
    zoneKey: config.zoneKey,
    key: config.key,
    url: config.url,
    name: config.name,
    description: config.description,
    properties: config.properties,
  };

  if (config.path) {
    data.path = config.path;
  }

  if (config.profiles) {
    data.profiles = [];
    _.forEach(config.profiles, (sysName) => {
      if (!profilesBySysName[sysName]) {
        throw new LeemonsError(ctx, {
          message: `Profile ${sysName} not found`,
        });
      }
      data.profiles!.push(profilesBySysName[sysName].id);
    });
  }
  return ctx.tx.call('widgets.widgets.setItemToZone', data);
}

/**
 * Add widget items to the database
 */
export async function addWidgetItemsDeploy({
  keyValueModel,
  items,
  ctx,
}: AddWidgetItemsDeployParams): Promise<void> {
  if (
    !(await hasKey(keyValueModel, `widgets-items-zones`)) ||
    process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
  ) {
    const { items: profiles } = (await ctx.tx.call('users.profiles.list', {
      page: 0,
      size: 10000,
    })) as ProfilesResponse;
    const profilesBySysName = _.keyBy(profiles, 'sysName');
    await Promise.allSettled(
      _.map(items, (config) =>
        setItemToZone({
          config,
          ctx,
          profilesBySysName,
        })
      )
    );
    await setKey(keyValueModel, `widgets-items-zones`);
  }
  ctx.tx.emit('init-widget-items');
}
