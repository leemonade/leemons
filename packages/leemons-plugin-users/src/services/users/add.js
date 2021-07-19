const _ = require('lodash');
const existManyProfiles = require('../profiles/existMany');
const { encryptPassword } = require('./encryptPassword');
const { table } = require('../tables');
const { exist } = require('./exist');

/**
 * Add a user to platform
 * @public
 * @static
 * @param {AddUser} userData - User data
 * @param {string[]} profiles - Profiles that the new user will have
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function add(
  { name, surnames, password, email, language, active },
  profiles,
  { transacting: _transacting } = {}
) {
  // TODO Validar entrada con ajv
  if (await exist({ email })) throw new Error(`"${email}" email already exists`);
  if (!(await existManyProfiles(profiles, { transacting: _transacting })))
    throw new Error('One of the ids specified as profile does not exist.');

  return global.utils.withTransaction(
    async (transacting) => {
      const user = await table.users.create(
        {
          name,
          surnames,
          email,
          password: password ? await encryptPassword(password) : undefined,
          language,
          active: active || false,
        },
        { transacting }
      );

      await table.userAuth.createMany(
        _.map(profiles, (profile) => ({
          profile,
          user: user.id,
          reloadPermissions: true,
        })),
        { transacting }
      );

      return user;
    },
    table.users,
    _transacting
  );
}

module.exports = add;
