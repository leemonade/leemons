const table = leemons.query('plugins_subjects::levelSchemas_teachingItems');

module.exports = async (levelSchema, items, { transacting } = {}) => {
  try {
    // Delete the existing items for the levelSchema
    return table.deleteMany(
      { levelSchemas_id: levelSchema, teachingItems_id_$in: items },
      { transacting }
    );
  } catch (e) {
    throw new Error("Can't delete the given values");
  }
};
