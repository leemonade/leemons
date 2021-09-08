const tables = {
  levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
  assignableProfiles: leemons.query('plugins_classroom::levelSchemas_profiles'),
};
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function get(id, { locale = null, transacting } = {}) {
  const validator = new global.utils.LeemonsValidator({
    type: 'string',
    format: 'uuid',
  });

  if (validator.validate(id)) {
    const levelSchema = await tables.levelSchemas.findOne({ id }, { transacting });
    if (!levelSchema) {
      throw new Error('LevelSchema not found');
    }
    levelSchema.properties = JSON.parse(levelSchema.properties);

    const assignableProfiles = (
      await tables.assignableProfiles.find({ levelSchemas_id: id }, { transacting })
    ).map(({ profiles_id: profile }) => profile);

    const nameKey = leemons.plugin.prefixPN(`levelSchemas.${id}.name`);
    if (locale) {
      const name = await multilanguage.getValue(nameKey, locale);
      return { ...levelSchema, assignableProfiles, name };
    }
    const names = (
      await multilanguage.getWithKey(nameKey, {
        transacting,
      })
    ).map(({ locale: _locale, value }) => ({ locale: _locale, value }));

    return {
      ...levelSchema,
      assignableProfiles,
      names,
    };
  }
  throw validator.error;
};
