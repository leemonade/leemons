const getSessionPermissions = require('../permissions/getSessionPermissions');

const tables = {
  levels: leemons.query('plugins_classroom::levels'),
  levelUsers: leemons.query('plugins_classroom::levels-users'),
};

module.exports = async function getUsers(level, { userSession, roles = [], transacting } = {}) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      viewUsers: leemons.plugin.config.constants.permissions.bundles.organization.viewUsers,
    },
  });

  // TODO: Add better error message
  if (!permissions.viewUsers) {
    throw new Error('Permissions not satisfied');
  }

  const schema = {
    type: 'object',
    properties: {
      level: {
        type: 'string',
        format: 'uuid',
      },
      roles: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 1,
        },
      },
    },
  };

  const validator = new global.utils.LeemonsValidator(schema);

  if (!validator.validate({ level, roles })) {
    throw validator.error;
  }

  return global.utils.withTransaction(
    async (t) => {
      if (await tables.levels.count({ id: level }, { transacting: t })) {
        let users;
        try {
          const query = { level };
          if (roles.length > 0) {
            query.role$_in = roles;
          }
          users = await tables.levelUsers.find(query);

          users = users.reduce((obj, user) => {
            if (Array.isArray(obj[user.role])) {
              obj[user.role].push(user.id);
            } else {
              // eslint-disable-next-line no-param-reassign
              obj[user.role] = [user.id];
            }
            return obj;
          }, {});
        } catch (e) {
          throw new Error("The users can't be deleted");
        }

        return users;
      }
      throw new Error('No level was found with the given id');
    },
    tables.levels,
    transacting
  );
};
