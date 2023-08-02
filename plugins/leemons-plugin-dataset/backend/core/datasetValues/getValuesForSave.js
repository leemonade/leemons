const _ = require('lodash');

function getValuesForSave(jsonSchema, key, value) {
  if (!value)
    return [
      {
        id: undefined,
        value: JSON.stringify(undefined),
        searchableValueString: undefined,
        metadata: undefined,
      },
    ];

  const config = jsonSchema.properties[key];
  if (config && config.frontConfig) {
    if (
      (config.frontConfig.type === 'multioption' ||
        config.frontConfig.type === 'list' ||
        config.frontConfig.type === 'group') &&
      _.isArray(value)
    ) {
      return _.map(value, (val, index) => ({
        id: val?.id || undefined,
        value: JSON.stringify(val.value),
        searchableValueString: val.searchableValueString || val.value,
        metadata: val.metadata
          ? JSON.stringify({ ...val.metadata, path: `[${index}]` })
          : JSON.stringify({ path: `[${index}]` }),
      }));
    }
    if (config.frontConfig.type === 'text_field' && config.frontConfig.onlyNumbers) {
      return [
        {
          id: value?.id || undefined,
          value: JSON.stringify(value.value),
          searchableValueNumber: value.value,
          metadata: JSON.stringify(value.metadata),
        },
      ];
    }
  }

  return [
    {
      id: value?.id || undefined,
      value: JSON.stringify(value.value),
      searchableValueString: value.searchableValueString || value.value,
      metadata: JSON.stringify(value.metadata),
    },
  ];
}

module.exports = { getValuesForSave };
