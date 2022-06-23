const { STATUS, profileSettings } = require('../../../config/constants');
const { table } = require('../tables');
const findOne = require('./findOne');
const update = require('./update');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function registerAdmin({ email, password, locale }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const currentSettings = await findOne({ transacting });
      if (currentSettings && currentSettings.status !== STATUS.LOCALIZED) {
        throw new Error('User already registered');
      }

      const { services: userService } = leemons.getPlugin('users');

      const profile = await userService.profiles.add(profileSettings);

      await userService.users.add(
        {
          email,
          password,
          locale,
          name: 'Super admin',
          birthdate: new Date(),
          gender: 'male',
          active: true,
        },
        [profile.role]
      );

      return update.call(
        this,
        {
          ...(currentSettings || {}),
          status: STATUS.ADMIN_CREATED,
        },
        { transacting }
      );
    },
    table.settings,
    _transacting
  );
}

module.exports = registerAdmin;
