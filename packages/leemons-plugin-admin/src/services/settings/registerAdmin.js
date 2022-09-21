const { STATUS, profileSettings } = require('../../../config/constants');
const { table } = require('../tables');
const findOne = require('./findOne');
const update = require('./update');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function registerAdmin(
  { email, password, locale, ...user },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const currentSettings = await findOne({ transacting });
      if (currentSettings && currentSettings.status !== STATUS.LOCALIZED) {
        throw new Error('Super Admin already registered');
      }

      const { services: userService } = leemons.getPlugin('users');

      const profile = await userService.profiles.saveBySysName(profileSettings, {
        sysName: profileSettings.sysName,
      });

      await userService.users.add(
        {
          email,
          password,
          locale,
          name: `${user?.name || 'Super'} ${user?.surnames || 'admin'}`,
          birthdate: user?.birthdate || new Date(),
          gender: user?.gender || 'male',
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
