const bulkTemplateNamespace = 'bulk-template';

const getTemplateStatusCacheKey = ({ ctx, key }) => {
  const { deploymentID } = ctx.meta;
  return `${bulkTemplateNamespace}:${deploymentID}:${key}`;
};

const getCurrentPhaseKey = (ctx) => getTemplateStatusCacheKey({ ctx, key: 'currentPhase' });
const getLastPhaseOnErrorKey = (ctx) => getTemplateStatusCacheKey({ ctx, key: 'lastPhaseOnError' });

module.exports = {
  bulkTemplateNamespace,
  getCurrentPhaseKey,
  getLastPhaseOnErrorKey,
  getTemplateStatusCacheKey,
};
