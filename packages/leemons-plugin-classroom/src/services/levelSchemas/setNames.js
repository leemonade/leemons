const getSessionPermissions = require('../permissions/getSessionPermissions');

const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levelSchemas = leemons.query('plugins_classroom::levelSchemas');

module.exports = async function setNames(id, names, { userSession, transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      update: leemons.plugin.config.constants.permissions.bundles.tree.update,
    },
  });
  // TODO: Add better error message
  if (!permissions.update) {
    throw new Error('Permissions not satisfied');
  }
  // ---------------------------------------------------------------------------
  // validate data types
  const schema = {
    type: 'object',
    properties: {
      names: {
        type: 'object',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, names })) {
    let savedNames;
    let missingLocales;

    const exists = await levelSchemas.count({ id }, { transacting });
    if (!exists) {
      throw new Error("The given id can't be found");
    }

    try {
      const nameKey = leemons.plugin.prefixPN(`levelSchemas.${id}.name`);
      const { namesToSet = {}, namesToDelete = [] } = Object.entries(names).reduce(
        (obj, [locale, value]) => {
          if (!value) {
            const _namesToDelete = obj.namesToDelete || [];
            return { ...obj, namesToDelete: [..._namesToDelete, locale] };
          }
          return { ...obj, namesToSet: { ...obj.namesToSet, [locale]: value } };
        },
        {}
      );

      // Save locales with value
      const { items, warnings } = await multilanguage.setManyByKey(nameKey, namesToSet, {
        transacting,
      });

      // Delete empty locales
      if (namesToDelete.length) {
        await multilanguage.deleteMany(
          namesToDelete.map((locale) => [nameKey, locale]),
          { transacting }
        );
      }

      if (warnings?.nonExistingLocales) {
        missingLocales = warnings.nonExistingLocales;
      }

      savedNames = items;
    } catch (e) {
      throw new Error("the translated names can't be saved");
    }
    return { names: savedNames, warnings: { missingLocales } };
  }
  throw validator.error;
};
