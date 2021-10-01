const table = leemons.query('plugins_subjects::teachingItems');
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async (_names, { transacting: t } = {}) => {
  const names = Array.isArray(_names) ? _names : [_names];

  return global.utils.withTransaction(
    async (transacting) => {
      let result;
      try {
        result = await table.deleteMany({ name_$in: names }, { transacting });
      } catch (e) {
        throw new Error("Can't delete the items");
      }
      // Delete localizations
      try {
        await Promise.all(
          names.map((name) =>
            multilanguage.deleteKeyStartsWith(leemons.plugin.prefixPN(`teaching.${name}`), {
              transacting,
            })
          )
        );
      } catch (e) {
        throw new Error("Can't delete localized values");
      }
      return result;
    },
    table,
    t
  );
};
