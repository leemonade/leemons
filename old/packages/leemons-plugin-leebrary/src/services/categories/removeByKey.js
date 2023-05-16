const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByKey } = require('./getByKey');

async function removeByKey(categoryKey, { transacting } = {}) {
  if (isEmpty(categoryKey)) {
    throw new global.utils.HttpError(400, 'Category key is required.');
  }

  const category = await getByKey(categoryKey, { transacting });

  if (!category || isEmpty(category)) {
    throw new global.utils.HttpError(400, 'Category not found.');
  }

  // ES: Revisamos que no existan assets asociados a la categoría
  // EN: Check if there are assets associated with the category
  const assets = await tables.assets.find({ category: category.id }, { transacting });

  if (!isEmpty(assets)) {
    throw new global.utils.HttpError(400, 'Category has assets.');
  }

  try {
    const deleted = await tables.categories.deleteMany({ key: categoryKey }, { transacting });
    return deleted;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to remove category: ${e.message}`);
  }
}

module.exports = { removeByKey };
