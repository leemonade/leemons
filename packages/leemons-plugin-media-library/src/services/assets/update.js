const { assets: table } = require('../tables');

module.exports = async function update(id, data, { transacting } = {}) {
  const asset = {
    cover: data.cover,
    name: data.name,
    description: data.description,
  };

  const item = await table.update({ id }, asset, { transacting });
  return item;
};
