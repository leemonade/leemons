const tables = {
  levels: leemons.query('plugins_classroom::levels'),
  levelUsers: leemons.query('plugins_classroom::levels-users'),
};

module.exports = function addUsers({ users, level, role } = {}, { transacting } = {}) {
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
          console.log(e);
          throw new Error("Can't check if the users already exists");
        }
        try {
          console.log(alreadySavedUsers);
          savedUsers = await tables.levelUsers.createMany(
            [...new Set(users.filter((user) => !alreadySavedUsers.includes(user)))].map(
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

        return savedUsers;
      }
      throw new Error('No level was found with the given id');
    },
    tables.levels,
    transacting
  );
};
