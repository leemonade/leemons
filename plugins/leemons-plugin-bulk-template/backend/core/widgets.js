const _ = require('lodash');

async function initWidgets() {
  const { widgets } = leemons.getPlugin('widgets').services;
  const { settings } = leemons.getPlugin('academic-portfolio').services;

  const profiles = await settings.getProfiles();

  const zoneReorders = {
    'plugins.dashboard.program.left': [
      'plugins.board-messages.dashboard',
      'plugins.academic-portfolio.user.classes.swiper',
      'plugins.assignables.dashboard.need-your-attention',
      'plugins.calendar.user.program.calendar',
      'plugins.calendar.user.program.kanban',
    ],
    'plugins.dashboard.class.tabs': [
      // 'plugins.dashboard.class.tab.control-panel',
      'plugins.assignables.class.tab.ongoing',
      'plugins.calendar.class.tab.kanban',
      'plugins.calendar.class.tab.calendar',
      'plugins.academic-portfolio.class.tab.detail',
    ],
    'plugins.assignables.class.ongoing': [
      'plugins.board-messages.class-dashboard',
      'plugins.assignables.dashboard.subject.need-your-attention',
      'plugins.assignables.class.ongoing',
    ],
    'plugins.academic-portfolio.class.detail': ['plugins.board-messages.class-dashboard'],
    // 'plugins.dashboard.class.control-panel': [
    //   'plugins.assignables.dashboard.subject.need-your-attention',
    //   'plugins.calendar.user.class.calendar',
    //   'plugins.calendar.user.class.kanban',
    // ],
  };

  const itemProfiles = [
    {
      zoneKey: 'plugins.dashboard.class.tabs',
      key: 'plugins.tasks.class.tab.students.tasks',
      profiles: [profiles.student],
    },
  ];

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
  await widgets.updateProfileItemsInZone(itemProfiles);

  return null;
}

module.exports = initWidgets;
