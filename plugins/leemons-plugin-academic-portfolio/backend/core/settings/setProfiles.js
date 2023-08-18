const { getProfiles } = require('./getProfiles');

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
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('programs') }),
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('profiles') }),
  ]);

  return getProfiles({ ctx });
}

module.exports = { setProfiles };
