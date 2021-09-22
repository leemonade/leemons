const getSessionPermissions = require('../permissions/getSessionPermissions');

const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levels = leemons.query('plugins_classroom::levels');

module.exports = async function setNames(id, names, { userSession, transacting } = {}) {
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

    const exists = await levels.count({ id }, { transacting });
    if (!exists) {
      throw new Error("The given id can't be found");
    }

    try {
      const { items, warnings } = await multilanguage.setManyByKey(
        leemons.plugin.prefixPN(`levels.${id}.name`),
        names,
        { transacting }
      );

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
