const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function updateProfiles({ items, ctx }) {
  let profiles = [];
  _.forEach(items, (item) => {
    profiles = profiles.concat(item.profiles);
  });
  // ES: Comprobamos que existan los perfiles
  if (_.isArray(profiles) && profiles.length > 0) {
    const existsProfiles = await ctx.tx.call('users.profiles.existMany', { ids: _.uniq(profiles) });
    if (!existsProfiles) {
      throw new LeemonsError(ctx, { message: 'Profiles does not exist' });
    }
  }

  // ES:  Borramos los perfiles actuales de los items
  await Promise.all(
    _.map(items, (item) =>
      ctx.tx.db.WidgetItemProfiles.deleteMany({
        zoneKey: item.zoneKey,
        key: item.key,
      })
    )
  );

  // ES: Insertamos los nuevos perfiles
  return Promise.all(
    _.map(items, (item) =>
      Promise.all(
        _.map(item.profiles, (profile) =>
          ctx.tx.db.WidgetItemProfiles.create({
            profile,
            zoneKey: item.zoneKey,
            key: item.key,
          }).then((mongooseDoc) => mongooseDoc.toObject())
        )
      )
    )
  );
}

module.exports = { updateProfiles };
