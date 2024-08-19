const allDatasetKey = [
  {
    plugin: 'plugin.dataset',
    scope: 'dataset',
  },
];

const getByLocationAndPluginKey = ({ locationName, pluginName, locale }) => [
  {
    ...allDatasetKey[0],
    action: 'getSchema',
    params: {
      locationName,
      pluginName,
      locale,
    },
  },
];

const getValuesKey = ({ locationName, pluginName, targetId }) => [
  {
    ...allDatasetKey[0],
    action: 'getValues',
    params: {
      locationName,
      pluginName,
      targetId,
    },
  },
];

export { allDatasetKey, getByLocationAndPluginKey, getValuesKey };
