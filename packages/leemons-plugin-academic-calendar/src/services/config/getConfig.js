const _ = require('lodash');
const { table } = require('../tables');

async function getConfig(program, { transacting } = {}) {
  const config = await table.config.findOne({ program }, { transacting });
  if (config) {
    config.courseDates = JSON.parse(config.courseDates);
    config.courseDays = JSON.parse(config.courseDays);
    config.courseHours = JSON.parse(config.courseHours);
    config.breaks = JSON.parse(config.breaks);
  }
  return config;
}

module.exports = { getConfig };
