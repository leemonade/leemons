async function saveDatasetField(locationName, pluginName, schemaConfig, schemaLocales, options) {
  return leemons.api('dataset/save-field', {
    allAgents: true,
    method: 'POST',
    body: { locationName, pluginName, schemaConfig, schemaLocales, options },
  });
}

export default saveDatasetField;
