const saveLocalization = require('./private/saveLocalization');
const exists = require('./exists');

const table = leemons.query('plugins_subjects::teachingItems');

module.exports = async (items, { transacting } = {}) => {
  const existingItems = await exists(
    items.map(({ name }) => name),
    { useNames: true, transacting }
  );

  const keys = items.reduce(
    (obj, item) => {
      const { name } = item;
      const key = existingItems[name] ? 'existing' : 'nonExisting';
      return {
        ...obj,
        [key]: [...obj[key], item],
      };
    },
    { existing: [], nonExisting: [] }
  );

  if (keys.existing.length) {
    // Save the localizations
    // TODO: Return mixed warnings
    await Promise.all(
      keys.existing.map(({ name, ...localizations }) =>
        saveLocalization(name, localizations, { deleteEmpty: true, transacting })
      )
    );
  }

  return items;
};
