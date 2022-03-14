const { set: updateSettings } = require('./set');

async function setDefaultCategory(categoryId, { transacting } = {}) {
  const settings = await updateSettings({ defaultCategory: categoryId }, { transacting });
  return settings;
}

module.exports = { setDefaultCategory };
