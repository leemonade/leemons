const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getPluginNameWithVersionIfHaveFromServiceName } = require('@leemons/service-name-parser');

const TEST_CONFIG = {
  'v1.curriculum': {
    deny: {
      menu: ['curriculum', 'curriculum-new', 'curriculum-library'],
    },
  },
  'v1.academic-portfolio': {
    deny: {
      menu: ['welcome', 'profiles', 'programs'],
      others: [
        'subjectType',
        'classSeats',
        'treeProgramForm',
        'treeClassNameAndTypeFromForm',
        'treeClassSecondTeacherAndImageFromForm',
      ],
    },
    limits: {
      maxSubjects: 6,
    },
    defaults: {
      classSeats: 50,
    },
  },
  'v1.academic-calendar': {
    deny: {
      others: ['addRegionalCalendar'],
    },
  },
  'v1.fundae': {
    deny: {
      menu: ['fundae', 'fundae-list'],
    },
  },
  'v1.users': {
    deny: {
      menu: ['roles-list', 'profile-list', 'user-data'],
    },
  },
  'v1.families': {
    deny: {
      menu: ['families', 'families-data'],
    },
  },
  'v1.grades': {
    deny: {
      menu: ['rules', 'welcome', 'evaluations', 'promotions', 'dependencies'],
    },
  },
};

/**
 * Get the deployment config from the database
 *
 * @param {MoleculerContext} ctx
 * @returns {Object} The deployment config
 */
async function getDeploymentConfigFromDB(ctx) {
  const deployment = await ctx.db.Deployment.findOne({ id: ctx.meta.deploymentID }, undefined, {
    disableAutoDeploy: true,
  }).lean();

  if (!deployment && process.env.DISABLE_AUTO_INIT === 'true') {
    throw new LeemonsError(ctx, { message: 'Deployment not found at get config' });
  }

  const { config = {}, type } = deployment;

  return { ...config, type };
}

/**
 * Get the deployment config based on the environment
 *
 * @param {MoleculerContext} ctx
 * @returns {Object} The deployment config
 */
async function getConfigBasedOnEnvironment(ctx) {
  if (
    ctx.meta.deploymentID === 'auto-deployment-id' &&
    process.env.TEST_DEPLOYMENT_CONFIG === 'true'
  ) {
    return TEST_CONFIG;
  }
  return getDeploymentConfigFromDB(ctx);
}

/**
 * Get the result for the plugin based on the config
 *
 * @param {Object} params
 * @param {Object} params.config The deployment config
 * @param {string} params.callerPlugin The caller plugin name
 * @param {boolean} params.ignoreVersion Whether to ignore the version
 * @returns {Object} The result
 */
function getResultForPlugin({ config, callerPlugin, ignoreVersion }) {
  const keys = Object.keys(config);
  let result = null;
  _.forEach(keys, (key) => {
    if (ignoreVersion) {
      if (key.split('.')[1] === callerPlugin.split('.')[1]) {
        result = config[key];
      }
    } else if (key === callerPlugin) {
      result = config[key];
    }
  });
  return result;
}

/**
 * Get the deployment config based on the params
 *
 * @param {Object} params
 * @param {Object} params.allConfig Wheter to get all plugins configurations
 * @param {boolean} params.ignoreVersion Whether to ignore the plugins versions
 * @param {MoleculerContext} params.ctx The moleculer context
 * @returns {Object} The deployment config
 */
async function getDeploymentConfig({ allConfig, ignoreVersion, ctx }) {
  const config = await getConfigBasedOnEnvironment(ctx);

  const callerPlugin = getPluginNameWithVersionIfHaveFromServiceName(ctx.caller);

  if (config && !allConfig) {
    return getResultForPlugin({ config, callerPlugin, ignoreVersion });
  }

  if (!config.helpdeskUrl && String(process.env.HELPDESK_URL).startsWith('http')) {
    config.helpdeskUrl = process.env.HELPDESK_URL;
  }

  return config;
}

module.exports = { getDeploymentConfig };
