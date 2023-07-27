const _ = require('lodash');
const { hasKey, setKey } = require('leemons-mongodb-helpers');

async function addWidgetZonesDeploy({ keyValueModel, zones, ctx }) {
  if (
    !(await hasKey(keyValueModel, `widgets-zones`)) ||
    process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
  ) {
    await Promise.allSettled(
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

module.exports = { addWidgetZonesDeploy };
