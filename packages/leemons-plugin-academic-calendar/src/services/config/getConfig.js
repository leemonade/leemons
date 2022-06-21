const _ = require('lodash');
const { table } = require('../tables');

async function getConfig(program, { transacting } = {}) {
  const config = await table.config.findOne({ program }, { transacting });
  if (config) {
    config.allCoursesHaveSameConfig = !!config.allCoursesHaveSameConfig;
    config.allCoursesHaveSameDates = !!config.allCoursesHaveSameDates;
    config.allCoursesHaveSameDays = !!config.allCoursesHaveSameDays;
    config.allCoursesHaveSameHours = !!config.allCoursesHaveSameHours;
    config.allDaysHaveSameHours = !!config.allDaysHaveSameHours;
    config.courseDates = JSON.parse(config.courseDates);
    config.courseDays = JSON.parse(config.courseDays);
    config.courseHours = JSON.parse(config.courseHours);
    config.breaks = JSON.parse(config.breaks);
  }
  return config;
}

module.exports = { getConfig };
