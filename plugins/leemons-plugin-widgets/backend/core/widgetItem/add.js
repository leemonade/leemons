const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { validatePrefix } = require('../validation/validate');
const { exists: existsZone } = require('../widgetZone');

async function add({ zoneKey, key, url, name, description, profiles, properties = {}, ctx }) {
  validatePrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  if (!url || !_.isString(url)) {
    throw new LeemonsError(ctx, { message: 'url is required' });
  }

  const existZone = await existsZone({ zoneKey, ctx });
  if (!existZone) {
    throw new LeemonsError(ctx, { message: `Zone with key ${zoneKey} does not exist` });
  }

  if (_.isArray(profiles) && profiles.length > 0) {
    const existsProfiles = ctx.tx.call('users.profiles.existMany', { ids: profiles });
    if (!existsProfiles) {
      throw new LeemonsError(ctx, { message: `Profiles does not exist` });
    }
  }

  const promises = [
    ctx.tx.db.WidgetItem.create({
      zoneKey,
      key,
      url,
      name,
      description,
      properties: JSON.stringify(properties),
      pluginName: ctx.callerPlugin,
    }),
  ];

  if (_.isArray(profiles) && profiles.length > 0) {
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

module.exports = { add };
