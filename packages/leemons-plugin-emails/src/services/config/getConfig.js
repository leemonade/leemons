const _ = require('lodash');

const table = {
  config: leemons.query('plugins_emails::config'),
};

const keysDefaults = {
  'disable-all-activity-emails': false,
  'new-assignation-email': true,
  'week-resume-email': 1,
  'new-assignation-per-day-email': false,
  'new-assignation-timeout-email': false,
};

async function getConfig(userAgent, { keys, transacting } = {}) {
  const query = {
    userAgent,
  };
  const configs = await table.config.find(query, { transacting });
  if (_.isString(keys)) {
    return configs.length ? JSON.parse(configs[0].value) : keysDefaults[keys];
  }
  let finalKeys = _.cloneDeep(keys);
  // Si no hay keys simulamos que nos han pedido todas las keys para no repetir el código
  if (!keys) {
    finalKeys = _.keys(keysDefaults);
  }
  // Si no hay alguna configuacion de las solicitadas en keys, se añade el valor por defecto en keysDefaults
  const keysWithDefaults = finalKeys.map((key) => {
    if (!_.find(configs, { key })) {
      return { key, value: keysDefaults[key] };
    }
    return { key, value: JSON.parse(_.find(configs, { key }).value) };
  });
  // Lo transformamos en un objeto
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
