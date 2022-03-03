const table = leemons.query('plugins_subjects::levelSchemas_teachingItems');

module.exports = async (levelSchema, items, { transacting } = {}) => {
  try {
    // Get the items registered in the table
    const savedItems = await table.find(
      { levelSchemas_id: levelSchema, teachingItems_id_$in: items },
      { columns: ['id', 'teachingItems_id'], transacting }
    );

    // Generate the object of booleans
    return items.reduce(
      (obj, item) => ({
        ...obj,
        [item]: Boolean(
          savedItems.find(({ teachingItems_id: teachingItems }) => teachingItems === item)
        ),
      }),
      {}
    );
  } catch (e) {
    throw new Error('Can not check which items are saved');
  }
};
