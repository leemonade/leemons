const levelSchemas = leemons.query('plugins_subjects::levelSchemas');

module.exports = async (id, { columns, transacting }) => {
  try {
    if (Array.isArray(id)) {
      return await levelSchemas.find({ id_$in: id }, { columns, transacting });
    }
    return await levelSchemas.findOne({ id }, { columns, transacting });
  } catch (e) {
    throw new Error("The LevelSchema can't be fetched");
  }
};
