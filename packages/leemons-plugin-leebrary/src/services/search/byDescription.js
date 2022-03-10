const assetDetails = require('../assets/details');
const { assets: table } = require('../tables');

module.exports = async function byDescription(
  description,
  { details = false, assets, transacting } = {}
) {
  try {
    const query = {
      description_$contains: description,
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
    throw new Error(`Failed to find asset with description: ${e.message}`);
  }
};
