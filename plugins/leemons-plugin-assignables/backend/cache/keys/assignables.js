const hash = require('object-hash');

const namespaces = require('../namespaces');

module.exports = {
  getAssignableKeyBuilder:
    ({ options, ctx }) =>
    (id) =>
      `${namespaces.assignables.get}:${ctx.meta.deploymentID}:id:${id}:userAgent:${ctx.meta.userSession?.userAgents?.[0]?.id}:options:${hash(options)}`,
};
