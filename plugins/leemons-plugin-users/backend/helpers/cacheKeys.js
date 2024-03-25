const hash = require('object-hash');

const permissionsNamespace = 'users.permissions';

const findPermissionsCacheKey = ({ ctx, query }) => {
  const queryHash = hash(query ?? {});
  return `${permissionsNamespace}:${ctx.meta.deploymentID}:find:${queryHash}`;
};

const getItemPermissionsCacheKey = ({ ctx, query }) => {
  const queryHash = hash(query ?? {});
  return `${permissionsNamespace}:${ctx.meta.deploymentID}:getItemPermissions:${queryHash}`;
};

const getAllItemsForTheUserAgentHasPermissionsCacheKey = ({ ctx, userAgent, query }) => {
  const queryHash = hash(query ?? {});

  return `${permissionsNamespace}:${ctx.meta.deploymentID}:${userAgent}:getAllItemsForTheUserAgentHasPermissions:${queryHash}`;
};

const getAllItemsForTheUserAgentHasPermissionsByTypeCacheKey = ({ ctx, userAgent, query }) => {
  const queryHash = hash(query ?? {});

  return `${permissionsNamespace}:${ctx.meta.deploymentID}:${userAgent}:getAllItemsForTheUserAgentHasPermissionsByType:${queryHash}`;
};

const getUserAgentPermissionsCacheKey = ({ ctx, userAgent, query }) => {
  const queryHash = hash(query ?? {});

  return `${permissionsNamespace}:${ctx.meta.deploymentID}:${userAgent}:getUserAgentPermissions:${queryHash}`;
};

module.exports = {
  permissionsNamespace,

  findPermissionsCacheKey,
  getItemPermissionsCacheKey,
  getAllItemsForTheUserAgentHasPermissionsCacheKey,
  getAllItemsForTheUserAgentHasPermissionsByTypeCacheKey,
  getUserAgentPermissionsCacheKey,
};
