const { set: updateSettings } = require('./set');

async function setDefaultCategory(categoryId, { transacting } = {}) {
  if (this.calledFrom !== 'plugins.leebrary') {
    throw new Error('Must be called from leemons-plugin-leebrary');
  }

  const settings = await updateSettings({ defaultCategory: categoryId }, { transacting });
  return settings;
}

module.exports = { setDefaultCategory };
