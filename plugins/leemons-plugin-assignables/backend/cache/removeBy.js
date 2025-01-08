const namespaces = require('./namespaces');

module.exports = {
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
};
