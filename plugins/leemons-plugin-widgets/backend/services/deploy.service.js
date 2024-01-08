/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const path = require('path');
const _ = require('lodash');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
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
  events: {},
  multiEvents: [
    {
      type: 'once-per-install',
      events: [
        'deployment-manager.finish',
        'dashboard.init-widget-items',
        'calendar.init-widget-items',
        'assignables.init-widget-items',
        'academic-portfolio.init-widget-items',
      ],
      handler: async (ctx) => {
        const profiles = await ctx.call('academic-portfolio.settings.getProfiles');

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
            'attendance-control.class.tabs.detail',
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
  ],
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
