async function getDatasetSchema(locationName, pluginName) {
  return leemons.api('dataset/get-schema', {
    allAgents: true,
    method: 'POST',
    body: { locationName, pluginName },
  });
}

export default getDatasetSchema;
