const getSessionPermissions = require('../permissions/getSessionPermissions');

const tables = {
  levels: leemons.query('plugins_classroom::levels'),
  levelUsers: leemons.query('plugins_classroom::levels-users'),
};

module.exports = async function removeUsers(
  { userSession, users, level, role = null } = {},
  { transacting } = {}
) {
  const permissions = await getSessionPermissions({
    userSession,
    this: this,
    permissions: {
      assignUsers: leemons.plugin.config.constants.permissions.bundles.organization.assignUsers,
    },
  });

  // TODO: Add better error message
  if (!permissions.assignUsers) {
    throw new Error('Permissions not satisfied');
  }
  const schema = {
    type: 'object',
    properties: {
      users: {
        oneOf: [
          {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
            minItems: 1,
          },
          {
            type: 'string',
            pattern: 'all',
          },
        ],
      },
      level: {
        type: 'string',
        format: 'uuid',
      },
      role: {
        type: 'string',
        minLength: 1,
        nullable: true,
      },
    },
  };

  const validator = new global.utils.LeemonsValidator(schema);
  if (!validator.validate({ users, level, role })) {
    throw validator.error;
  }

  return global.utils.withTransaction(
    async (t) => {
      if (await tables.levels.count({ id: level }, { transacting: t })) {
        let deletedCount;
        try {
          const query = { level };
          if (Array.isArray(users)) {
            query.user_$in = users;
          }
          if (role) {
            query.role = role;
          }
          deletedCount = await tables.levelUsers.deleteMany(query, { transacting: t });
        } catch (e) {
          throw new Error("The users can't be deleted");
        }

        try {
          const permission = {
            permissionName: 'plugins.classroom.level',
            target: level,
          };

          await leemons
            .getPlugin('users')
            .services.users.removeCustomPermission(users, permission, {
              transacting: t,
            });
        } catch (e) {
          throw new Error("Can't save permissions");
        }

        return deletedCount.count;
      }
      throw new Error('No level was found with the given id');
    },
    tables.levels,
    transacting
  );
};
