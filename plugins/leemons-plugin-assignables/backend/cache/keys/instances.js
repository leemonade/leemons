const hash = require('object-hash');

const namespaces = require('../namespaces');

module.exports = {
  getInstanceKeyBuilder:
    ({ options, ctx }) =>
    (id) =>
      `${namespaces.instances.get}:${ctx.meta.deploymentID}:id:${id}:userAgent:${ctx.meta.userSession?.userAgents?.[0]?.id}:options:${hash(options)}`,
};
