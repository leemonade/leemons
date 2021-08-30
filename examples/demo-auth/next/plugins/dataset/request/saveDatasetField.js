async function saveDatasetField(locationName, pluginName, schemaConfig, schemaLocales) {
  return leemons.api(
    {
      url: 'dataset/save-field',
      allAgents: true,
    },
    {
      method: 'POST',
      body: { locationName, pluginName, schemaConfig, schemaLocales },
    }
  );
}

export default saveDatasetField;
