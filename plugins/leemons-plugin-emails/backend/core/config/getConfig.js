const _ = require('lodash');

const keysDefaults = {
  'disable-all-activity-emails': false,
  'new-assignation-email': true,
  'week-resume-email': 1,
  'new-assignation-per-day-email': false,
  'new-assignation-timeout-email': false,
};

async function getConfig({ keys, userAgent, ctx }) {
  const isJustOneKey = _.isString(keys);

  const query = {
    userAgent,
  };

  if (isJustOneKey) {
    query.key = keys;
  }

  const configs = await ctx.tx.db.Config.find(query).lean();

  if (isJustOneKey) {
    return configs.length ? JSON.parse(configs[0].value || null) : keysDefaults[keys];
  }

  const configKeys = configs.map((config) => config.key);
  const keysWithDefaults = configKeys.map((key) => {
    const config = _.find(configs, { key });
    return { key, value: config ? JSON.parse(config?.value) : keysDefaults[key] };
  });

  // Return an object with the keys and values
  return _.reduce(
    keysWithDefaults,
    (acc, { key, value }) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
}

module.exports = { getConfig, keysDefaults };
