const saveLocalization = require('./private/saveLocalization');
const exists = require('./exists');

const table = leemons.query('plugins_subjects::teachingItems');

module.exports = async (_items, { transacting } = {}) => {
  let items = _items;
  if (!Array.isArray(items)) {
    items = [items];
  }

  // Check which items already exists
  const existingItems = await exists(
    items.map(({ name }) => name),
    { transacting }
  );

  // Separate existing items from non-existing
  items = items.reduce(
    (obj, item) => {
      const { name } = item;
      const key = existingItems[name] ? 'existing' : 'new';
      return {
        ...obj,
        [key]: [...obj[key], item],
      };
    },
    { existing: [], new: [] }
  );

  if (items.new.length) {
    // Create the registries
    try {
      await table.createMany(items.new, {
        transacting,
      });
    } catch (e) {
      throw new Error("Can't save the new teaching items");
    }

    // Save the localizations
    // TODO: Return mixed warnings
    await Promise.all(
      items.new.map(({ name, ...localizations }) =>
        saveLocalization(name, localizations, { transacting })
      )
    );
  }

  return { items };
};
