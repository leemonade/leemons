const { assets: table } = require('../tables');

module.exports = async function byName(name, { assets, transacting } = {}) {
  try {
    const query = {
      name_$contains: name,
    };

    if (assets) {
      query.id_$in = assets;
    }

    const entries = await table.find(query, { columns: ['id'], transacting });
    return entries.map((entry) => entry.id);
  } catch (e) {
    throw new Error(`Failed to find asset with name: ${e.message}`);
  }
};
