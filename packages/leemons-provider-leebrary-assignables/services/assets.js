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

    const assignableObjs = await Promise.all(
      assignablesIds.map((id) => assignables.getAssignable(id, { userSession, transacting }))
    );

    const assets = _.map(assignableObjs, 'asset.id');

    if (assetsIds?.length) {
      return _.intersection(assets, assetsIds);
    }
    return assets;
  },
};
