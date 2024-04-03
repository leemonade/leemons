const path = require('path');
const _ = require('lodash');
const { Agenda } = require('@hokify/agenda');

const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('@leemons/widgets');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsEmailsMixin } = require('@leemons/emails');

const { menuItems, widgets, permissions } = require('../config/constants');
const { getServiceModels } = require('../models');
const { afterAddClassTeacher } = require('../core/events/afterAddClassTeacher');
const { afterRemoveClassesTeachers } = require('../core/events/afterRemoveClassesTeachers');
const { sendRememberEmails } = require('../core/events/sendRememberEmail');
const { sendWeeklyEmails } = require('../core/events/sendWeeklyEmail');
const { renderEmailTemplates } = require('../core/deploy/renderEmailTemplates');

const SERVICE_NAME = 'assignables.deploy';

// TODO: Implement cron job for sending emails

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  name: SERVICE_NAME,
  version: 1,
  mixins: [
    LeemonsMultilanguageMixin({
      locales: ['es', 'en'],
      i18nPath: path.resolve(__dirname, `../i18n/`),
    }),
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
    LeemonsEmailsMixin(),
  ],
  multiEvents: [
    {
      type: 'once-per-install',
      events: ['menu-builder.init-main-menu', 'assignables.init-permissions'],
      handler: async (ctx) => {
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: menuItems,
          ctx,
        });
        ctx.tx.emit('init-menu');
      },
    },
    {
      type: 'once-per-install',
      events: [
        'leebrary.init-menu',
        'assignables.init-permissions',
        'assignables.init-menu',
        'assignables.init-widget-zones',
        'assignables.init-widget-items',
      ],
      handler: async (ctx) => {
        ctx.tx.emit('init-plugin');
      },
    },
  ],
  events: {
    /* -- New Deployment or plugin installation -- */
    'deployment-manager.install': async (ctx) => {
      // Widgets
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });

      // Register as a library provider
      await ctx.tx.call('leebrary.providers.register', {
        name: 'Library Assignables',
        supportedMethods: {
          getByIds: true,
          search: true,
        },
      });
    },
    /* --- Academic Portfolio --- */
    'academic-portfolio.after-add-class-teacher': async (ctx) => {
      await afterAddClassTeacher({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-remove-classes-teachers': async (ctx) => {
      await afterRemoveClassesTeachers({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-add-class-student': async (ctx) => {
      const {
        addStudentsToOpenInstancesWithClass,
        // eslint-disable-next-line global-require
      } = require('../core/assignations/addStudentToOpenInstancesWithClass');
      await addStudentsToOpenInstancesWithClass({ ...ctx.params, ctx });
    },

    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions,
        ctx,
      });
    },
  },
  actions: {
    sendRememberEmails: {
      handler(ctx) {
        return sendRememberEmails({ ctx });
      },
    },
    sendWeeklyEmails: {
      handler(ctx) {
        return sendWeeklyEmails({ ctx });
      },
    },
  },
  async created() {
    const customCall = async ({ actionName }) => {
      const r = async ({ deploymentId }) => {
        const manager = await this.broker.call(
          'deployment-manager.getGoodActionToCall',
          {
            actionName,
          },
          { caller: SERVICE_NAME, meta: { deploymentID: deploymentId } }
        );
        return this.broker.call(
          manager.actionToCall,
          {},
          {
            caller: SERVICE_NAME,
            meta: { deploymentID: deploymentId, relationshipID: manager.relationshipID },
          }
        );
      };
      const deploymentIds = await this.broker.call('deployment-manager.getAllDeploymentIds');
      await Promise.allSettled(_.map(deploymentIds, (deploymentId) => r({ deploymentId })));
    };

    const agenda = new Agenda({ db: { address: process.env.MONGO_URI } });
    agenda.define('assignables_sendRememberEmails', async () => {
      await customCall({ actionName: 'assignables.deploy.sendRememberEmails' });
    });
    agenda.define('assignables_sendWeeklyEmails', async () => {
      await customCall({ actionName: 'assignables.deploy.sendWeeklyEmails' });
    });
    await agenda.start();

    await agenda.every('0 * * * *', 'assignables_sendRememberEmails');
    await agenda.every('0 10 * * *', 'assignables_sendWeeklyEmails');
  },
  async started() {
    const emailTemplates = renderEmailTemplates();
    await this.initEmailTemplates(emailTemplates);

    this.logger.debug('Email templates initialized');
  },
};
