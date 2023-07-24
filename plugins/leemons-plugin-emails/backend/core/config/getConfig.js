const _ = require('lodash');

const keysDefaults = {
  'disable-all-activity-emails': false,
  'new-assignation-email': true,
  'week-resume-email': 1,
  'new-assignation-per-day-email': false,
  'new-assignation-timeout-email': false,
};

async function getConfig({ keys, userAgent, ctx }) {
  const query = {
    userAgent,
  };
  const configs = await ctx.tx.db.Config.find(query).lean();

  if (_.isString(keys)) {
    //! NOTA: No entiendo esta lógica
    //* Si es la key es un string (no piden más que una) y se recibe por lo menos una configuración
    //* ¿Por qué se le da la primera que hay? Ni si quiera miramos si es de la key que queremos!!!!
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
