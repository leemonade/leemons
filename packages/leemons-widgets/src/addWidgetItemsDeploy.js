const _ = require('lodash');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');
const { LeemonsError } = require('@leemons/error');

async function setItemToZone({ config, ctx, profilesBySysName }) {
  const data = {
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
        throw new LeemonsError(ctx, { message: `Profile ${sysName} not found` });
      }
      data.profiles.push(profilesBySysName[sysName].id);
    });
  }
  return ctx.tx.call('widgets.widgets.setItemToZone', data);
}

async function addWidgetItemsDeploy({ keyValueModel, items, ctx }) {
  // const startTime = new Date();
  // const hasKeyStartTime = new Date();
  if (
    !(await hasKey(keyValueModel, `widgets-items-zones`)) ||
    process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
  ) {
    // console.log('Has widgets items KEY: ' + (new Date() - hasKeyStartTime) + 'ms');
    // const allSettledStartTime = new Date();
    const { items: profiles } = await ctx.tx.call('users.profiles.list', { page: 0, size: 10000 });
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
    // console.log('Widgets items allSettled: ' + (new Date() - allSettledStartTime) + 'ms');
    await setKey(keyValueModel, `widgets-items-zones`);
  }
  ctx.tx.emit('init-widget-items');
  // console.log('Create widgets items: ' + (new Date() - startTime) + 'ms');
}

module.exports = { addWidgetItemsDeploy };
