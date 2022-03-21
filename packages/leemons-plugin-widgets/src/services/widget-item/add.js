const _ = require('lodash');
const { table } = require('../tables');
const { validatePrefix } = require('../../validation/validate');
const { exists: existsZone } = require('../widget-zone/exists');

async function add(zoneKey, key, url, { name, description, transacting } = {}) {
  validatePrefix(key, this.calledFrom);
  if (!url || !_.isString(url)) {
    throw new Error('url is required');
  }

  const existZone = await existsZone(zoneKey, { transacting });
  if (!existZone) {
    throw new Error(`Zone with key ${zoneKey} does not exist`);
  }

  const split = this.calledFrom.split('.');
  split.shift();

  return table.widgetItem.create(
    {
      zoneKey,
      key,
      url,
      name,
      description,
      pluginName: split.join('.'),
    },
    { transacting }
  );
}

module.exports = { add };
