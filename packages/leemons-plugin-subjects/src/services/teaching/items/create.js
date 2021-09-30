const exists = require('./exists');

const table = leemons.query('plugins_subjects::teachingItems');

module.exports = async (_items, { transacting } = {}) => {
  let items = _items;
  if (!Array.isArray(items)) {
    items = [items];
  }

  const existingItems = await exists(items, { useNames: true, transacting });

  items = items.reduce(
    (obj, item) => {
      const key = existingItems[item] ? 'existing' : 'new';
      return {
        ...obj,
        [key]: [...obj[key], item],
      };
    },
    { existing: [], new: [] }
  );

  if (items.new.length) {
    try {
      await table.createMany(
        items.new.map((item) => ({ name: item })),
        {
          transacting,
        }
      );
    } catch (e) {
      throw new Error("Can't save the new teaching items");
    }
  }

  return items;
};
