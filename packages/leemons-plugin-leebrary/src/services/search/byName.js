const { assets: table } = require('../tables');
const assetDetails = require('../assets/details');

module.exports = async function byName(name, { details = false, assets, transacting } = {}) {
  try {
    const query = {
      name_$contains: name,
    };

    if (assets) {
      query.id_$in = assets;
    }

    let entries = await table.find(query, { columns: ['id'], transacting });
    entries = entries.map((entry) => entry.id);
    if (details) {
      return assetDetails(entries, { transacting });
    }
    return entries;
  } catch (e) {
    throw new Error(`Failed to find asset with name: ${e.message}`);
  }
};
