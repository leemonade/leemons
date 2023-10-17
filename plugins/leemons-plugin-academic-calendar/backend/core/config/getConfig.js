const _ = require('lodash');

async function getConfig({ program, ctx }) {
  const config = await ctx.tx.db.Config.findOne({ program }).lean();
  if (config) {
    if (config.regionalConfig) {
      config.regionalConfig = await ctx.tx.db.RegionalConfig.findOne({
        id: config.regionalConfig,
      }).lean();
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
