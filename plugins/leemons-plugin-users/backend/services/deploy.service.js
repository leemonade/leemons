/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const path = require('path');
const _ = require('lodash');

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { addWidgetZonesDeploy } = require('@leemons/widgets');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsEmailsMixin } = require('@leemons/emails');
const {
  updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset,
} = require('../core/user-agents/updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset');

const { getServiceModels } = require('../models');
const { addMany } = require('../core/actions');
const {
  defaultActions,
  defaultDatasetLocations,
  defaultPermissions,
  menuItems,
  widgets,
} = require('../config/constants');
const {
  createInitialProfiles,
} = require('../core/profiles/createInitialProfiles/createInitialProfiles');
const { renderEmailTemplates } = require('../core/deploy/renderEmailTemplates');

const initDataset = async ({ ctx }) => {
  if (!(await hasKey(ctx.tx.db.KeyValue, 'dataset-locations'))) {
    await Promise.all(
      _.map(defaultDatasetLocations, (config) => ctx.tx.call('dataset.dataset.addLocation', config))
    );
    await setKey(ctx.tx.db.KeyValue, 'dataset-locations');
  }
  ctx.tx.emit('init-dataset-locations');
};

async function addMenuItems(ctx) {
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
}

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.deploy',
  version: 1,
  mixins: [
    LeemonsMultilanguageMixin({
      locales: ['en', 'es'],
      i18nPath: path.resolve(__dirname, `../i18n/`),
    }),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
    LeemonsEmailsMixin(),
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Actions
      if (!(await hasKey(ctx.tx.db.KeyValue, `actions`))) {
        await addMany({ data: defaultActions, ctx });
        await setKey(ctx.tx.db.KeyValue, `actions`);
      }
      ctx.tx.emit('init-actions');

      // Permissions
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: defaultPermissions,
        ctx,
      });
      // Register widget zone
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });

      // Dataset Locations
      await initDataset({ ctx });
    },
    'menu-builder.init-main-menu': async (ctx) => addMenuItems(ctx),
    'deployment-manager.config-change': async (ctx) => addMenuItems(ctx),
    'dataset.save-field': async (ctx) => {
      await updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset(ctx.params);
    },
    'users.change-platform-locale': async (ctx) => {
      await createInitialProfiles({ ctx });
      ctx.tx.emit('init-profiles');
    },
  },
  async started() {
    const emailTemplates = renderEmailTemplates();
    await this.initEmailTemplates(emailTemplates);
  },
};
