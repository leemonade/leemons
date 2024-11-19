const hash = require('object-hash');

const assetsNamespace = 'leebrary.assets';

const searchAssetsCacheKey = ({ ctx, query }) => {
  const queryHash = hash(query ?? {});
  return `${assetsNamespace}:${ctx.meta.deploymentID}:search:${queryHash}`;
};

module.exports = {
  assetsNamespace,
  searchAssetsCacheKey,
};
