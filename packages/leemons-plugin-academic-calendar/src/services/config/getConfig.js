const _ = require('lodash');
const { table } = require('../tables');

async function getConfig(program, { transacting } = {}) {
  const config = await table.config.findOne({ program }, { transacting });
  if (config) {
    if (config.regionalConfig) {
      config.regionalConfig = await table.regionalConfig.findOne(
        { id: config.regionalConfig },
        { transacting }
      );
      config.regionalConfig = {
        ...config.regionalConfig,
        regionalEvents: JSON.parse(config.regionalConfig.regionalEvents),
        localEvents: JSON.parse(config.regionalConfig.localEvents),
        daysOffEvents: JSON.parse(config.regionalConfig.daysOffEvents),
      };
    }
    config.allCoursesHaveSameConfig = !!config.allCoursesHaveSameConfig;
    config.allCoursesHaveSameDates = !!config.allCoursesHaveSameDates;
    config.allCoursesHaveSameDays = !!config.allCoursesHaveSameDays;
    config.substagesDates = JSON.parse(config.substagesDates);
    config.courseEvents = JSON.parse(config.courseEvents);
    config.courseDates = JSON.parse(config.courseDates);
    config.breaks = JSON.parse(config.breaks);
  }
  return config;
}

module.exports = { getConfig };
