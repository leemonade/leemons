const _ = require('lodash');
const { table } = require('../tables');
const { validatePrefix } = require('../../validation/validate');
const { exists: existsZone } = require('../widget-zone/exists');

async function add(
  zoneKey,
  key,
  url,
  { name, description, profiles, properties = {}, transacting } = {}
) {
  validatePrefix(key, this.calledFrom);
  if (!url || !_.isString(url)) {
    throw new Error('url is required');
  }

  const existZone = await existsZone(zoneKey, { transacting });
  if (!existZone) {
    throw new Error(`Zone with key ${zoneKey} does not exist`);
  }

  if (_.isArray(profiles) && profiles.length > 0) {
    const existsProfiles = await leemons
      .getPlugin('users')
      .services.profiles.existMany(profiles, { transacting });
    if (!existsProfiles) {
      throw new Error('Profiles does not exist');
    }
  }

  const split = this.calledFrom.split('.');
  split.shift();

  const promises = [
    table.widgetItem.create(
      {
        zoneKey,
        key,
        url,
        name,
        description,
        properties: JSON.stringify(properties),
        pluginName: split.join('.'),
      },
      { transacting }
    ),
  ];

  if (_.isArray(profiles) && profiles.length > 0) {
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

module.exports = { add };
