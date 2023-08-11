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

// TODO Migration: ¿Hace falta eso ahora? No aparece el directorio emails en el core de users ¿Por qué?
/*
const recoverEmail = require('../core /emails/recoverPassword');
async function initEmails({ ctx }) {
  // await leemons
  //   .getPlugin('emails')
  //   .services.email.addIfNotExist(
  //     'user-recover-password',
  //     'es',
  //     'Recuperar contraseña',
  //     recoverEmail.es,
  //     leemons.getPlugin('emails').services.email.types.active
  //   );
  ctx.tx.call('emails.email.addIfNotExist', {
    template: 'user-recover-password',
    language: 'es',
    subject: 'Recuperar contraseña',
    html: recoverEmail.es,
    type: (await ctx.tx.call('emails.email.types')).active,
  });
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-recover-password',
      'en',
      'Recover password',
      recoverEmail.en,
      leemons.getPlugin('emails').services.email.types.active
    );
  leemons.events.emit('init-email-recover-password');
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-reset-password',
      'es',
      'Su contraseña fue restablecida',
      resetPassword.es,
      leemons.getPlugin('emails').services.email.types.active
    );
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-reset-password',
      'en',
      'Your password was reset',
      resetPassword.en,
      leemons.getPlugin('emails').services.email.types.active
    );
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-welcome',
      'es',
      'Bienvenida',
      welcomeEmail.es,
      leemons.getPlugin('emails').services.email.types.active
    );
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-welcome',
      'en',
      'Welcome',
      welcomeEmail.en,
      leemons.getPlugin('emails').services.email.types.active
    );
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-new-profile-added',
      'es',
      'Nuevo perfil',
      newProfileAdded.es,
      leemons.getPlugin('emails').services.email.types.active
    );
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-new-profile-added',
      'en',
      'New profile',
      newProfileAdded.en,
      leemons.getPlugin('emails').services.email.types.active
    );
  leemons.events.emit('init-email-reset-password');
  leemons.events.emit('init-emails');
}
*/

const initDataset = async ({ ctx }) => {
  // TODO Migration: Hemos usado la llamada a deploy manager para ver si está instalado o no
  // ? Está eso bien? o es mejor "jugar" con la colección KeyValue ?
  const isInstalled = ctx.tx.call('deployment-manager.pluginIsInstalled', {
    pluginName: 'users',
  });
  if (!isInstalled) {
    await Promise.all(
      _.map(defaultDatasetLocations, (config) => ctx.tx.call('dataset.dataset.addLocation', config))
    );
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
      // Default Actions
      // eslint-disable-next-line global-require
      const actionsService = require('../core/actions');
      await actionsService.init({ ctx });
      ctx.tx.emit('init-actions');
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

      // TODO Migration: ¿No haría falta el código de abajo según el events.js? El directorio core/user-agents/__update__ ya no existe...
      /*
      const {
        syncUserAgentCenterProfilePermissionsIfNeed,
      } = require('../core/user-agents/__update__/syncUserAgentCenterProfilePermissionsIfNeed');
      await syncUserAgentCenterProfilePermissionsIfNeed(isInstalled);
      */
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
      const {
        updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset,
        // eslint-disable-next-line global-require
      } = require('../core/user-agents/updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset');
      await updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset(ctx.params);
    },
    'users.change-platform-locale': async (ctx) => {
      createInitialProfiles({ ctx });
    },
    // TODO Migration: Faltan archivos para que funcione el initEmails (ver TODO de arriba)
    /*
    'emails:pluginDidLoadServices': async (ctx) => {
      await initEmails();
    },
    */
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
