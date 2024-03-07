import prepareAsset from '@leebrary/helpers/prepareAsset';

async function getAssetsByIds(assets, filters = {}) {
  if (!assets?.length) return [];
  const response = await leemons.api(`v1/leebrary/assets/list`, {
    allAgents: true,
    body: {
      assets,
      filters,
    },
    method: 'POST',
  });

  return {
    ...response,
    assets: response.assets.map((asset) => {
      if (!asset.classesCanAccess?.length) {
        return asset;
      }

      return {
        ...asset,
        classesCanAccess: asset.classesCanAccess.map((klass) => {
          const icon = prepareAsset(klass.icon);
          return {
            ...klass,
            avatar: icon.url || icon.cover,
          };
        }),
      };
    }),
  };
}

export default getAssetsByIds;
