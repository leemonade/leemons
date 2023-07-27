const _ = require('lodash');
const { hasKey, setKey } = require('leemons-mongodb-helpers');

async function addWidgetItemsDeploy({ keyValueModel, items, ctx }) {
  if (
    !(await hasKey(keyValueModel, `widgets-items-zones`)) ||
    process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
  ) {
    await Promise.allSettled(
      _.map(items, (config) =>
        ctx.tx.call('widgets.widgets.setItemToZone', {
          zoneKey: config.zoneKey,
          key: config.key,
          url: config.url,
          name: config.name,
          description: config.description,
          properties: config.properties,
        })
      )
    );
    await setKey(keyValueModel, `widgets-items-zones`);
  }
  ctx.tx.emit('init-widget-items');
}

module.exports = { addWidgetItemsDeploy };
