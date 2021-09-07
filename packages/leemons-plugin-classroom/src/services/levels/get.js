const table = leemons.query('plugins_classroom::levels');
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function get(id, { locale = null, transacting } = {}) {
  const validator = new global.utils.LeemonsValidator({
    type: 'string',
    format: 'uuid',
  });

  if (validator.validate(id)) {
    const level = await table.findOne({ id }, { transacting });
    if (!level) {
      throw new Error('Level not found');
    }

    const key = leemons.plugin.prefixPN(`levels.${id}`);
    if (locale) {
      const name = await multilanguage.getValue(`${key}.name`, locale);
      const description = await multilanguage.getValue(`${key}.description`, locale);
      return { ...level, name, description };
    }
    const names = (
      await multilanguage.getWithKey(`${key}.name`, {
        transacting,
      })
    ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

    const descriptions = (
      await multilanguage.getWithKey(`${key}.description`, {
        transacting,
      })
    ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

    const users = await leemons.plugin.services.levels.getUsers(id);

    return { ...level, names, descriptions, users };
  }
  throw validator.error;
};
