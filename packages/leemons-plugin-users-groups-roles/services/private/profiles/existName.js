const { table } = require('../tables');

async function existName(name) {
  const response = await table.profiles.count({
    $or: [{ name }, { uri: global.utils.slugify(name) }],
  });
  return !!response;
}

module.exports = { existName };
