const { last } = require('lodash');

/**
 * Return default hostname por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getHostname({ ctx }) {
  const [config, deployment] = await Promise.all([
    ctx.tx.db.Config.findOne({ key: 'platform-hostname' }).lean(),
    ctx.tx.call('deployment-manager.getDeployment'),
  ]);
  const hostname = config?.value;
  const protocol = hostname?.startsWith('https://') ? 'https://' : 'http://';
  // Use the last domain of the deployment instead of the deprecated hostname
  return `${protocol}${last(deployment.domains)}`;
}

module.exports = getHostname;
