const hash = require('object-hash');

const { PLUGIN_NAME } = require('../../../config/constants');

const namespace = `${PLUGIN_NAME}.calendar`;

function calendarsToFrontendCacheKey({ ctx, query }) {
  const queryHash = hash(query ?? {});
  return `${namespace}:${ctx.meta.deploymentID}:calendarsToFrontend:${queryHash}`;
}

module.exports = {
  namespace,
  calendarsToFrontendCacheKey,
};
