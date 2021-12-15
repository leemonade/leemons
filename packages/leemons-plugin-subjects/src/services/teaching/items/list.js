const get = require('./get');

const table = leemons.query('plugins_subjects::teachingItems');

module.exports = async (locale, { transacting } = {}) => {
  const names = await table.find({}, { columns: ['name'], transacting });
  const localizations = await get(
    names.map(({ name }) => name),
    locale,
    { transacting }
  );

  return Object.entries(localizations).map(([name, label]) => ({ name, label }));
};
