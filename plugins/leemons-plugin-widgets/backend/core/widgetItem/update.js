const _ = require('lodash');
const { validatePrefix } = require('../validation/validate');
const { LeemonsError } = require('leemons-error');

async function update({ zoneKey, key, url, name, description, properties, profiles, ctx }) {
  validatePrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  const toUpdate = {
    zoneKey,
  };
  if (!_.isUndefined(url)) toUpdate.url = url;
  if (!_.isUndefined(name)) toUpdate.name = name;
  if (!_.isUndefined(description)) toUpdate.description = description;
  if (!_.isUndefined(properties)) toUpdate.properties = JSON.stringify(properties);
  if (_.isArray(profiles)) {
    await ctx.tx.db.WidgetItemProfile.deleteMany({ key });
  }
  const promises = [ctx.tx.db.WidgetItem.findOneAndUpdate({ key }, toUpdate, { new: true })];
  if (_.isArray(profiles) && profiles.length > 0) {
    const existsProfiles = await leemons.getPlugin('users').services.profiles.existMany(profiles);
    if (!existsProfiles) {
      throw new LeemonsError(ctx, { message: 'Profiles does not exist' });
    }

    _.forEach(profiles, (profile) => {
      promises.push(
        ctx.tx.db.WidgetItemProfile.create({
          zoneKey,
          key,
          profile,
        })
      );
    });
  }
  const [item] = await Promise.all(promises);
  return item;
}

module.exports = { update };
