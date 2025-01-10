const { LeemonsError } = require('@leemons/error');
const hash = require('object-hash');

const namespaces = require('../namespaces');

module.exports = {
  getAssignationKeyBuilder:
    ({ options, ctx }) =>
    (id) => {
      if (typeof id?.id === 'string') {
        return `${namespaces.assignations.get}:${ctx.meta.deploymentID}:id:${id?.id ?? id}:userAgent:${ctx.meta.userSession?.userAgents?.[0]?.id}:options:${hash(options)}`;
      }

      if (typeof id?.instance === 'string' && typeof id?.user === 'string') {
        return `${namespaces.assignations.get}:${ctx.meta.deploymentID}:instance:${id.instance}:user:${id.user}:userAgent:${ctx.meta.userSession?.userAgents?.[0]?.id}:options:${hash(options)}`;
      }

      throw new LeemonsError(ctx, {
        message: 'Invalid assignation id format for cache key',
        httpStatusCode: 400,
        code: 'INVALID_ASSIGNATION_ID',
      });
    },
};
