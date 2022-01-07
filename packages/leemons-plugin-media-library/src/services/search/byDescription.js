const { assets: table } = require('../tables');

module.exports = async function byDescription(description, { assets, transacting } = {}) {
  try {
    const query = {
      description_$contains: description,
    };

    if (assets) {
      query.id_$in = assets;
    }

    const entries = await table.find(query, { columns: ['id'], transacting });
    return entries.map((entry) => entry.id);
  } catch (e) {
    throw new Error(`Failed to find asset with description: ${e.message}`);
  }
};
