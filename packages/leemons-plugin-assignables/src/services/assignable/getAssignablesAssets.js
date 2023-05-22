const { assignables } = require('../tables');

module.exports = async function getAssignablesAssets(ids, { transacting }) {
  const assignablesFound = await assignables.find(
    { id_$in: ids },
    { columns: ['id', 'asset'], transacting }
  );

  const assetsByAssignable = {};

  assignablesFound.forEach(({ id, asset }) => {
    assetsByAssignable[id] = asset;
  });

  return assetsByAssignable;
};
