/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');

const path = require('path');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');

const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { permissions, datasetLocations } = require('../config/constants');
const { getServiceModels } = require('../models');

const initDataset = async ({ ctx }) => {
  if (!(await hasKey(ctx.tx.db.KeyValue, 'dataset-locations'))) {
    await Promise.all(
      _.map(datasetLocations, (config) => ctx.tx.call('dataset.dataset.addLocation', config))
    );
    await setKey(ctx.tx.db.KeyValue, 'dataset-locations');
  }
  ctx.tx.emit('init-dataset-locations');
};

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'families-emergency-numbers.deploy',
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
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Dataset
      await initDataset({ ctx });
    },
    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });
    },
  },
});
