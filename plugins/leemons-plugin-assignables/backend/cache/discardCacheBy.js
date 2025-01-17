const namespaces = require('./namespaces');

module.exports = {
  assignables: {
    discardGetAssignableCacheById: async ({ ids, ctx }) => {
      await ctx.cache.deleteByNamespace(namespaces.assignables.get, (key) =>
        ids.some((id) => key.includes(`:id:${id}`))
      );
    },
    discardGetAssignableCacheByUserAgent: async ({ ids, userAgent, ctx }) => {
      await ctx.cache.deleteByNamespace(namespaces.assignables.get, (key) =>
        ids.some((id) => key.includes(`:id:${id}:userAgent:${userAgent.id}`))
      );
    },
  },
  instances: {
    discardGetInstancesCacheById: async ({ ids, ctx }) => {
      await ctx.cache.deleteByNamespace(namespaces.instances.get, (key) =>
        ids.some((id) => key.includes(`:id:${id}`))
      );
    },
  },
  assignations: {
    discardGetAssignationsCacheById: async ({ ids, ctx }) => {
      await ctx.cache.deleteByNamespace(namespaces.assignations.get, (key) =>
        ids.some(
          ({ id, instance, user }) =>
            (id && key.includes(`:id:${id}`)) ||
            (instance && user && key.includes(`:instance:${instance}:user:${user}`))
        )
      );
    },
  },
};
