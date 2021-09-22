const getSessionPermissions = require('../permissions/getSessionPermissions');

const tables = {
  levels: leemons.query('plugins_classroom::levels'),
  levelUsers: leemons.query('plugins_classroom::levels-users'),
};

module.exports = async function addUsers(
  { users, level, role } = {},
  { userSession, transacting } = {}
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
        type: 'array',
        items: {
          type: 'string',
          format: 'uuid',
        },
        minItems: 1,
      },
      level: {
        type: 'string',
        format: 'uuid',
      },
      role: {
        type: 'string',
        minLength: 1,
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
        let alreadySavedUsers;
        let savedUsers;

        try {
          alreadySavedUsers = (
            await tables.levelUsers.find({ user_$in: users }, { columns: ['user'] })
          ).map(({ user }) => user);
        } catch (e) {
          throw new Error("Can't check if the users already exists");
        }

        const newUsers = [...new Set(users.filter((user) => !alreadySavedUsers.includes(user)))];
        try {
          savedUsers = await tables.levelUsers.createMany(
            newUsers.map(
              (user) => ({
                level,
                user,
                role,
              }),
              { transacting: t }
            )
          );
        } catch (e) {
          if (e.code.includes('ER_NO_REFERENCED_ROW')) {
            throw new Error('Some of the users does not exists');
          }
          throw new Error("The users can't be saved");
        }

        try {
          const permission = {
            permissionName: 'plugins.classroom.level',
            actionNames: ['admin'],
            target: level,
          };

          await leemons
            .getPlugin('users')
            .services.permissions.addCustomPermissionToUserAgent(newUsers, permission, {
              transacting: t,
            });
        } catch (e) {
          throw new Error("Can't save permissions");
        }

        return savedUsers;
      }
      throw new Error('No level was found with the given id');
    },
    tables.levels,
    transacting
  );
};
