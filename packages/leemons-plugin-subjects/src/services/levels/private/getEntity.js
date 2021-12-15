const levels = leemons.query('plugins_subjects::levels');

module.exports = async (id, { columns, transacting }) => {
  try {
    if (Array.isArray(id)) {
      return await levels.find({ id_$in: id }, { columns, transacting });
    }
    return await levels.findOne({ id }, { columns, transacting });
  } catch (e) {
    throw new Error("The Level can't be fetched");
  }
};
