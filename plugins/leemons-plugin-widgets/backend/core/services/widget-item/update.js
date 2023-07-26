const _ = require('lodash');
const { table } = require('../tables');
const { validatePrefix } = require('../../validation/validate');

async function update(
  zoneKey,
  key,
  { url, name, description, properties, profiles, transacting } = {}
) {
  validatePrefix(key, this.calledFrom);
  const toUpdate = {
    zoneKey,
  };
  if (!_.isUndefined(url)) toUpdate.url = url;
  if (!_.isUndefined(name)) toUpdate.name = name;
  if (!_.isUndefined(description)) toUpdate.description = description;
  if (!_.isUndefined(properties)) toUpdate.properties = JSON.stringify(properties);
  if (_.isArray(profiles)) {
    await table.widgetItemProfile.deleteMany({ key }, { transacting });
  }
  const promises = [table.widgetItem.update({ key }, toUpdate, { transacting })];
  if (_.isArray(profiles) && profiles.length > 0) {
    const existsProfiles = await leemons
      .getPlugin('users')
      .services.profiles.existMany(profiles, { transacting });
    if (!existsProfiles) {
      throw new Error('Profiles does not exist');
    }

    _.forEach(profiles, (profile) => {
      promises.push(
        table.widgetItemProfile.create(
          {
            zoneKey,
            key,
            profile,
          },
          { transacting }
        )
      );
    });
  }
  const [item] = await Promise.all(promises);
  return item;
}

module.exports = { update };
