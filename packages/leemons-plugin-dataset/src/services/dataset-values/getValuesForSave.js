const _ = require('lodash');

function getValuesForSave(jsonSchema, key, value) {
  const config = jsonSchema.properties[key];
  if (config && config.frontConfig) {
    if (config.frontConfig.type === 'multioption' && _.isArray(value)) {
      return _.map(value, (val, index) => ({
        id: val.id || undefined,
        value: JSON.stringify(val.value),
        searchableValueString: val.value,
        metadata: JSON.stringify({ path: `[${index}]` }),
      }));
    }
    if (config.frontConfig.type === 'text_field' && config.frontConfig.onlyNumbers) {
      return [
        {
          id: value.id || undefined,
          value: JSON.stringify(value.value),
          searchableValueNumber: value.value,
        },
      ];
    }
  }
  return [
    {
      id: value.id || undefined,
      value: JSON.stringify(value.value),
      searchableValueString: value.value,
    },
  ];
}

module.exports = { getValuesForSave };
