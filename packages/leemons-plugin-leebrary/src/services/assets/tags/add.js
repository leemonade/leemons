const { tables } = require('../../tables');
const { getByAsset } = require('./getByAsset');
const { exists: assetExists } = require('../exists');

module.exports = async function add(asset, tags, { transacting } = {}) {
  try {
    // TODO: Add permissions to tags
    if (!(await assetExists(asset, { transacting }))) {
      throw new global.utils.HttpError(422, `Asset with id ${asset} does not exist`);
    }

    const existingTags = await getByAsset(asset, { transacting });
    const newTags = tags.filter((tag) => !existingTags.includes(tag));
    if (newTags.length) {
      await tables.assetTags.createMany(
        newTags.map((tag) => ({ asset, tag })),
        { transacting }
      );
      return true;
    }
    return false;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to add tag: ${e.message}`);
  }
};
