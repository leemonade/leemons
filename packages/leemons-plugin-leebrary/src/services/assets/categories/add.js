const { tables } = require('../../tables');
const { exists } = require('./exists');
const { exists: assetExists } = require('../exists');
const { exists: categoryExists } = require('../../categories/exists');

async function add(assetId, categoryId, { transacting } = {}) {
  try {
    if (!(await assetExists(assetId, { transacting }))) {
      throw new global.utils.HttpError(422, `Asset with id ${assetId} does not exist`);
    }

    if (!(await categoryExists({ id: categoryId }, { transacting }))) {
      throw new global.utils.HttpError(422, `Category with id ${categoryId} does not exist`);
    }

    if (!(await exists(assetId, categoryId, { transacting }))) {
      return await tables.assetCategories.create(
        { asset: assetId, category: categoryId },
        { transacting }
      );
    }
    return null;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to add category: ${e.message}`);
  }
}

module.exports = { add };
