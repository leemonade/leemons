const { getProfiles } = require('./getProfiles');
const enableMenuItemService = require('../menu-builder/enableItem');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function setProfiles({ teacher, student, ctx }) {
  await Promise.all([
    ctx.tx.db.Configs.updateOne(
      {
        key: 'profile.teacher',
      },
      {
        key: 'profile.teacher',
        value: teacher,
      },
      { upsert: true }
    ),
    ctx.tx.db.Configs.updateOne(
      {
        key: 'profile.student',
      },
      {
        key: 'profile.student',
        value: student,
      },
      { upsert: true }
    ),
  ]);
  await Promise.all([
    enableMenuItemService({ key: 'profiles', ctx }),
    enableMenuItemService({ key: 'programs', ctx }),
  ]);

  return getProfiles({ ctx });
}

module.exports = { setProfiles };
