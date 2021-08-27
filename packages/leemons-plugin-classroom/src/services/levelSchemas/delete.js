const tables = {
  levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
  assignableProfiles: leemons.query('plugins_classroom::levelSchemas_profiles'),
};
const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

module.exports = async function get(id, { transacting } = {}) {
  const validator = new global.utils.LeemonsValidator({
    type: 'string',
    format: 'uuid',
  });

  if (validator.validate(id)) {
    const levelSchema = await tables.levelSchemas.findOne({ id }, { transacting });
    if (!levelSchema) {
      throw new Error('LevelSchema not found');
    }

    if ((await tables.levelSchemas.count({ parent: id }, { transacting })) > 0) {
      throw new Error("Can't delete a LevelSchema with children");
    }

    await tables.assignableProfiles.deleteMany({ levelSchemas_id: id }, { transacting });
    await multilanguage.deleteAll(
      { key: leemons.plugin.prefixPN(`levelSchemas.${id}.name`) },
      { transacting }
    );
    await tables.levelSchemas.delete({ id }, { transacting });

    return true;
  }
  throw validator.error;
};
