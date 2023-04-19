const _ = require('lodash');
const getAssetsByIds = require('../src/services/getByAssetIds');

module.exports = {
  getByIds: getAssetsByIds,
  search: async (
    criteria,
    { query, category, assets: assetsIds, published, preferCurrent, userSession, transacting }
  ) => {
    const { assignables } = leemons.getPlugin('assignables').services;

    const role = category.key.replace('assignables.', '');

    const assignablesIds = await assignables.searchAssignables(
      role,
      {
        published,
        preferCurrent,
        search: criteria,
        subjects: query?.subjects,
        program: query?.program,
      },
      { transacting, userSession }
    );

    const assets = await assignables.getAssignablesAssets(assignablesIds, { transacting });

    if (assetsIds?.length) {
      return _.intersection(Object.values(assets), assetsIds);
    }
    return Object.values(assets);
  },
};
