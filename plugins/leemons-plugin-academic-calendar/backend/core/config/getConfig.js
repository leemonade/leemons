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
        regionalEvents: JSON.parse(config.regionalConfig.regionalEvents || null),
        localEvents: JSON.parse(config.regionalConfig.localEvents || null),
        daysOffEvents: JSON.parse(config.regionalConfig.daysOffEvents || null),
      };
    }
    config.allCoursesHaveSameConfig = !!config.allCoursesHaveSameConfig;
    config.allCoursesHaveSameDates = !!config.allCoursesHaveSameDates;
    config.allCoursesHaveSameDays = !!config.allCoursesHaveSameDays;
    config.substagesDates = JSON.parse(config.substagesDates || null);
    config.courseEvents = JSON.parse(config.courseEvents || null);
    config.courseDates = JSON.parse(config.courseDates || null);
    config.breaks = JSON.parse(config.breaks || null);
  }
  return config;
}

module.exports = { getConfig };
