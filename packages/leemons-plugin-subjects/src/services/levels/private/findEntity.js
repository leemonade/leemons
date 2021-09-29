const levels = leemons.query('plugins_subjects::levels');

module.exports = async (query, { count = false, columns, transacting }) => {
  try {
    if (count) {
      return await levels.count(query, { transacting });
    }
    return await levels.find(query, { columns, transacting });
  } catch (e) {
    throw new Error("The requested Levels can't be fetched");
  }
};
