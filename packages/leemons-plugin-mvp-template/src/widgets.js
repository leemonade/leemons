const _ = require('lodash');

async function initWidgets() {
  const { widgets } = leemons.getPlugin('widgets').services;

  /*
   * {
   *   zoneKey: [itemKey, itemKey, ...],
   * }
   * */

  const zoneReorders = {
    'plugins.dashboard.program.left': [
      'plugins.academic-portfolio.user.classes.swiper',
      'plugins.calendar.user.program.calendar',
      'plugins.calendar.user.program.kanban',
    ],
  };

  const zones = await Promise.all(
    _.map(Object.keys(zoneReorders), (zoneKey) => widgets.getZone(zoneKey))
  );

  const itemsToUpdate = [];
  _.forEach(zones, (zone) => {
    const itemKeys = zoneReorders[zone.key];
    _.forEach(zone.widgetItems, (item) => {
      const index = itemKeys.indexOf(item.key);
      if (index !== -1) {
        itemsToUpdate.push({
          id: item.id,
          order: index,
        });
      }
    });
  });

  await widgets.updateOrderItemsInZone(itemsToUpdate);

  return null;
}

module.exports = initWidgets;
