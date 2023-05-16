const { tables } = require('../tables');

async function exists(assetId, { transacting } = {}) {
  const count = await tables.assets.count({ id: assetId }, { transacting });
  return count > 0;
}

module.exports = { exists };
