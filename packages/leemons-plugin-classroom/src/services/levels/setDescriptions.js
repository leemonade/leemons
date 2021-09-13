const getSessionPermissions = require('../permissions/getSessionPermissions');

const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levels = leemons.query('plugins_classroom::levels');

module.exports = async function setNames(id, descriptions, { userSession, transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      update: leemons.plugin.config.constants.permissions.bundles.organization.update,
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
      descriptions: {
        type: 'object',
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, descriptions })) {
    let savedDescriptions;
    let missingLocales;

    const exists = await levels.count({ id }, { transacting });
    if (!exists) {
      throw new Error("The given id can't be found");
    }

    try {
      const { items, warnings } = await multilanguage.setManyByKey(
        leemons.plugin.prefixPN(`levels.${id}.description`),
        descriptions,
        { transacting }
      );

      if (warnings?.nonExistingLocales) {
        missingLocales = warnings.nonExistingLocales;
      }

      savedDescriptions = items;
    } catch (e) {
      throw new Error("the translated descriptions can't be saved");
    }
    return { descriptions: savedDescriptions, warnings: { missingLocales } };
  }
  throw validator.error;
};
