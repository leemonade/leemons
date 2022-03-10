const { assetCategories } = require('../../tables');
const has = require('./has');
const assetExists = require('../exists');

module.exports = async function add(asset, category, { transacting } = {}) {
  const { name } = category;
  const { id } = asset;

  try {
    if (!(await assetExists(id, { transacting }))) {
      throw new Error(`Asset with id ${id} does not exist`);
    }

    if (!(await has(asset, category, { transacting }))) {
      await assetCategories.create({ asset: id, category: name }, { transacting });
      return true;
    }
    return false;
  } catch (e) {
    throw new Error(`Failed to add category: ${e.message}`);
  }
};
