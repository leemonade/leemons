const levelSchemas = leemons.query('plugins_subjects::levelSchemas');

module.exports = async (query, { count = false, columns, transacting }) => {
  try {
    if (count) {
      return await levelSchemas.count(query, { transacting });
    }
    return await levelSchemas.find(query, { columns, transacting });
  } catch (e) {
    throw new Error("The requested LevelSchemas can't be fetched");
  }
};
