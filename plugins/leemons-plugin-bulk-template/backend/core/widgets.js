const _ = require('lodash');

async function initWidgets() {
  const { widgets } = leemons.getPlugin('widgets').services;
  const { settings } = leemons.getPlugin('academic-portfolio').services;

  const profiles = await settings.getProfiles();

  const zoneReorders = {
    'dashboard.program.left': [
      'board-messages.dashboard',
      'academic-portfolio.user.classes.swiper',
      'assignables.dashboard.need-your-attention',
      'calendar.user.program.calendar',
      'calendar.user.program.kanban',
    ],
    'dashboard.class.tabs': [
      // 'dashboard.class.tab.control-panel',
      'assignables.class.tab.ongoing',
      'calendar.class.tab.kanban',
      'calendar.class.tab.calendar',
      'academic-portfolio.class.tab.detail',
    ],
    'assignables.class.ongoing': [
      'board-messages.class-dashboard',
      'assignables.dashboard.subject.need-your-attention',
      'assignables.class.ongoing',
    ],
    'academic-portfolio.class.detail': ['board-messages.class-dashboard'],
    // 'dashboard.class.control-panel': [
    //   'assignables.dashboard.subject.need-your-attention',
    //   'calendar.user.class.calendar',
    //   'calendar.user.class.kanban',
    // ],
  };

  const itemProfiles = [
    {
      zoneKey: 'dashboard.class.tabs',
      key: 'tasks.class.tab.students.tasks',
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
