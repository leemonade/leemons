const _ = require('lodash');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');

async function addWidgetItemsDeploy({ keyValueModel, items, ctx }) {
  let startTime = new Date();
  let hasKeyStartTime = new Date();
  if (
    !(await hasKey(keyValueModel, `widgets-items-zones`)) ||
    process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
  ) {
    console.log('Has widgets items KEY: ' + (new Date() - hasKeyStartTime) + 'ms');
    let allSettledStartTime = new Date();
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
    console.log('Widgets items allSettled: ' + (new Date() - allSettledStartTime) + 'ms');
    await setKey(keyValueModel, `widgets-items-zones`);
  }
  ctx.tx.emit('init-widget-items');
  console.log('Create widgets items: ' + (new Date() - startTime) + 'ms');
}

module.exports = { addWidgetItemsDeploy };
