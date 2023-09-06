/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const path = require('path');
const _ = require('lodash');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { hasKey, setKey } = require('leemons-mongodb-helpers');
const { addPermissionsDeploy } = require('leemons-permissions');
const { addMenuItemsDeploy } = require('leemons-menu-builder');
const { addWidgetZonesDeploy } = require('leemons-widgets');
const { getEmailTypes } = require('leemons-emails');
const { LeemonsMQTTMixin } = require('leemons-mqtt');
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
const recoverEmail = require('../emails/recoverPassword');
const resetPassword = require('../emails/resetPassword');
const welcomeEmail = require('../emails/welcome');
const newProfileAdded = require('../emails/newProfileAdded');

async function initEmails({ ctx }) {
  await ctx.tx.call('emails.email.addIfNotExist', {
    template: 'user-recover-password',
    language: 'es',
    subject: 'Recuperar contraseña',
    html: recoverEmail.es,
    type: getEmailTypes().active,
  });

  await ctx.tx.call('emails.email.addIfNotExist', {
    templateName: 'user-recover-password',
    language: 'en',
    subject: 'Recover password',
    html: recoverEmail.en,
    type: getEmailTypes().active,
  });

  ctx.tx.emit('init-email-recover-password');

  await ctx.tx.call('emails.email.addIfNotExist', {
    templateName: 'user-reset-password',
    language: 'es',
    subject: 'Su contraseña fue restablecida',
    html: resetPassword.es,
    type: getEmailTypes().active,
  });

  await ctx.tx.call('emails.email.addIfNotExist', {
    templateName: 'user-reset-password',
    language: 'en',
    subject: 'Your password was reset',
    html: resetPassword.en,
    type: getEmailTypes().active,
  });

  await ctx.tx.call('emails.email.addIfNotExist', {
    templateName: 'user-welcome',
    language: 'es',
    subject: 'Bienvenida',
    html: welcomeEmail.es,
    type: getEmailTypes().active,
  });

  await ctx.tx.call('emails.email.addIfNotExist', {
    templateName: 'user-welcome',
    language: 'en',
    subject: 'Welcome',
    html: welcomeEmail.en,
    type: getEmailTypes().active,
  });

  await ctx.tx.call('emails.email.addIfNotExist', {
    templateName: 'user-new-profile-added',
    language: 'es',
    subject: 'Nuevo perfil',
    html: newProfileAdded.es,
    type: getEmailTypes().active,
  });

  await ctx.tx.call('emails.email.addIfNotExist', {
    templateName: 'user-new-profile-added',
    language: 'en',
    subject: 'New profile',
    html: newProfileAdded.en,
    type: getEmailTypes().active,
  });

  ctx.tx.emit('init-email-reset-password');
  ctx.tx.emit('init-emails');
}

const initDataset = async ({ ctx }) => {
  if (!(await hasKey(ctx.tx.db.KeyValue, 'dataset-locations'))) {
    await Promise.all(
      _.map(defaultDatasetLocations, (config) => ctx.tx.call('dataset.dataset.addLocation', config))
    );
    await setKey(ctx.tx.db.KeyValue, 'dataset-locations');
  }
  ctx.tx.emit('init-dataset-locations');
};

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.deploy',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
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
      // Locales
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ['es', 'en'],
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      // Register widget zone
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });

      // Dataset Locations
      await initDataset({ ctx });

      // email Templates
      await initEmails({ ctx });
    },
    'menu-builder.init-main-menu': async (ctx) => {
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
    'multilanguage.newLocale': async (ctx) => {
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ctx.params.code,
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      return null;
    },
    'dataset.save-field': async (ctx) => {
      await updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset(ctx.params);
    },
    'users.change-platform-locale': async (ctx) => {
      await createInitialProfiles({ ctx });
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
