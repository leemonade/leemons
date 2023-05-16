const { uniq, map } = require('lodash');
const tables = require('../../../tables');
const { getAssetsData } = require('./getAssetsData');

async function getAssignablesData(assignables, { userSession, transacting }) {
  const uniqAssignables = uniq(assignables);

  const assignablesObj = {};

  const assignablesData = await tables.assignables.find(
    {
      id_$in: uniqAssignables,
    },
    { columns: ['asset', 'id', 'role'], transacting }
  );

  const assetsIds = map(assignablesData, 'asset');
  const assetsData = await getAssetsData(assetsIds, { userSession, transacting });

  assignablesData.forEach((assignable) => {
    assignablesObj[assignable.id] = { ...assignable, asset: assetsData[assignable.asset] };
  });

  return assignablesObj;
}

module.exports = { getAssignablesData };
