const exists = require('./items/exists');
const getLevelSchema = require('../levelSchemas/private/getEntity');
const has = require('./has');

const table = leemons.query('plugins_subjects::levelSchemas_teachingItems');
module.exports = async (levelSchema, items, { transacting } = {}) => {
  // Check if levelSchema exists
  if (!(await getLevelSchema(levelSchema, { columns: ['id'], transacting }))) {
    throw new Error('The given LevelSchema does not exists');
  }

  // Check if the items exists
  const existingItems = await exists(items, { transacting });

  // Check which ones are already added
  const itemsAdded = await has(levelSchema, items);

  // Segregate items by existing, non existing and already added
  const { existing, nonExisting, alreadyAdded } = items.reduce(
    (obj, item) => {
      let key = existingItems[item] ? 'existing' : 'nonExisting';
      key = itemsAdded[item] ? 'alreadyAdded' : key;

      return {
        ...obj,
        [key]: [...obj[key], item],
      };
    },
    { existing: [], nonExisting: [], alreadyAdded: [] }
  );

  // Create the new items
  if (existing.length) {
    try {
      await table.createMany(
        existing.map((item) => ({ levelSchemas_id: levelSchema, teachingItems_id: item })),
        { transacting }
      );
    } catch (e) {
      throw new Error("Can't add the teaching items to the LevelSchema");
    }
  }

  return {
    added: existing,
    alreadyAdded,
    nonExisting,
  };
};
