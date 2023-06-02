const { table } = require('../tables');

async function existName(name, id, { transacting } = {}) {
  const query = {
    $or: [{ name }, { uri: global.utils.slugify(name, { lower: true }) }],
  };
  if (id) query.id_$ne = id;
  const response = await table.profiles.count(query, { transacting });
  return !!response;
}

module.exports = { existName };
