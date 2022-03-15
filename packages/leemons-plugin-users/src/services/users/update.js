const { table } = require('../tables');
const { setPreferences } = require('../user-preferences/setPreferences');

async function update(
  userId,
  { birthdate, preferences, ...data },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const user = await table.users.update(
        { id: userId },
        {
          birthdate: birthdate ? global.utils.sqlDatetime(birthdate) : birthdate,
          ...data,
        },
        { transacting }
      );

      if (preferences) {
        await setPreferences(user.id, preferences, { transacting });
      }

      return user;
    },
    table.users,
    _transacting
  );
}

module.exports = { update };
