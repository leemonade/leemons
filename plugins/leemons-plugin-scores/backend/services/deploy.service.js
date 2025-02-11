/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsEmailsMixin } = require('@leemons/emails');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const path = require('path');

const { menuItems, permissions } = require('../config/constants');
const { renderEmailTemplates } = require('../core/deploy/renderEmailTemplates');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'scores.deploy',
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
    LeemonsEmailsMixin(),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  multiEvents: [
    {
      type: 'once-per-install',
      events: ['menu-builder.init-main-menu', 'scores.init-permissions'],
      handler: async (ctx) => {
        const [mainMenuItem, ...otherMenuItems] = menuItems;

        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: mainMenuItem,
          ctx,
        });
        ctx.tx.emit('init-menu');
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: otherMenuItems,
          ctx,
        });
        ctx.tx.emit('init-submenu');
      },
    },
  ],
  events: {
    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions,
        ctx,
      });
    },
  },
  async started() {
    const emailTemplates = await renderEmailTemplates();
    await this.initEmailTemplates(emailTemplates);
  },
});
