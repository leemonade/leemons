/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveRegionalConfig } = require('../../validations/forms');

async function saveRegionalConfig(
  { created_at, updated_at, deleted_at, deleted, ...data },
  { transacting } = {}
) {
  validateSaveRegionalConfig(data);
  let config;

  data.regionalEvents = JSON.stringify(data.regionalEvents);
  data.localEvents = JSON.stringify(data.localEvents);
  data.daysOffEvents = JSON.stringify(data.daysOffEvents);
  if (data.id) {
    config = await table.regionalConfig.update({ id: data.id }, data, { transacting });
  } else {
    config = await table.regionalConfig.create(data, { transacting });
  }
  return config;
}

module.exports = { saveRegionalConfig };
