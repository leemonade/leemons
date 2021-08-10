async function getDatasetSchema(locationName, pluginName) {
  return leemons.api(
    {
      url: 'dataset/get-schema',
      allAgents: true,
    },
    {
      method: 'POST',
      body: { locationName, pluginName },
    }
  );
}

export default getDatasetSchema;
