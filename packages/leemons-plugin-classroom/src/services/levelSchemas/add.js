const tables = {
  levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
  assignableProfiles: leemons.query('plugins_classroom::levelSchemas_profiles'),
};

const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();

async function add({ name: names, parent = null, isClass = false, assignableProfiles = [] } = {}) {
  const levelSchema = { name: names, parent, isClass, assignableProfiles };

  console.log(levelSchema);

  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      name: {
        type: 'object',
      },
      parent: {
        type: ['string', 'null'],
      },
      isClass: {
        type: 'boolean',
      },
      assignableProfiles: {
        type: 'array',
      },
    },
  });
  if (validator.validate(levelSchema)) {
    const ls = await global.utils.withTransaction(async (transacting) => {
      const savedLevelSchema = await tables.levelSchemas.create(levelSchema, { transacting });
      console.log(savedLevelSchema);

      const savedAssignableProfiles = await Promise.all(
        assignableProfiles.map((profile) => {
          return tables.assignableProfiles.create(
            {
              levelSchemas_id: savedLevelSchema.id,
              profiles_id: profile,
            },
            { transacting }
          );
        })
      );

      const savedNames = await Promise.all(
        Object.entries(names).map(([locale, value]) => {
          console.log(locale, value);
          return multilanguage.add(
            leemons.plugin.prefixPN(`levelSchemas.${savedLevelSchema.id}.name`),
            locale,
            value,
            {
              transacting,
            }
          );
        })
      );
      return { ...savedLevelSchema, assignableProfiles: savedAssignableProfiles, name: savedNames };
    }, tables.levelSchemas);

    console.log(ls);
  } else {
    console.log(validator.error);
  }
}

module.exports = add;
