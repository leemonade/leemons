/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const _ = require('lodash');

const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = {
  name: 'widgets.deploy',
  version: 1,
  mixins: [
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'users.init-profiles': async (ctx) => {
      const profiles = await ctx.call('academic-portfolio.settings.getProfiles');

      const zoneReorders = {
        'dashboard.program.left': [
          'board-messages.dashboard',
          'academic-portfolio.user.classes.swiper',
          'dashboard.dashboard.welcome',
          'assignables.dashboard.progress',
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
          'attendance-control.class.tabs.detail',
          'learning-paths.class.tab.modules',
          'assignables.class.tab.progress',
        ],
        'assignables.class.ongoing': [
          'board-messages.class-dashboard',
          'dashboard.dashboard.classes.welcome',
          'assignables.dashboard.subject.need-your-attention',
          'assignables.class.ongoing',
        ],
        'academic-portfolio.class.detail': ['board-messages.class-dashboard'],
        // 'dashboard.class.control-panel': [
        //   'assignables.dashboard.subject.need-your-attention',
        //   'calendar.user.class.calendar',
        //   'calendar.user.class.kanban',
        // ],
        'leebrary.drawer.tabs': ['leebrary.drawer.tabs.library', 'leebrary.drawer.tabs.new'],
      };

      const itemProfiles = [
        {
          zoneKey: 'dashboard.class.tabs',
          key: 'tasks.class.tab.students.tasks',
          profiles: [profiles.student],
        },
      ];

      const zones = await Promise.all(
        _.map(Object.keys(zoneReorders), (zoneKey) =>
          ctx.tx.call('widgets.widgets.getZone', { key: zoneKey })
        )
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

      await ctx.call('widgets.widgets.updateOrderItemsInZone', { items: itemsToUpdate });
      await ctx.call('widgets.widgets.updateProfileItemsInZone', { items: itemProfiles });

      return null;
    },
  },
};
