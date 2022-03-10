const { assetTags } = require('../../tables');
const get = require('./get');
const assetExists = require('../exists');

module.exports = async function add(asset, tags, { transacting } = {}) {
  try {
    // TODO: Add permissions to tags
    if (!(await assetExists(asset, { transacting }))) {
      throw new Error(`Asset with id ${asset} does not exist`);
    }

    const existingTags = await get(asset, { transacting });
    const newTags = tags.filter((tag) => !existingTags.includes(tag));
    if (newTags.length) {
      await assetTags.createMany(
        newTags.map((tag) => ({ asset, tag })),
        { transacting }
      );
      return true;
    }
    return false;
  } catch (e) {
    throw new Error(`Failed to add tag: ${e.message}`);
  }
};
