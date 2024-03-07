async function getDatasetSchema(locationName, pluginName) {
  return leemons.api('v1/dataset/dataset/get-schema', {
    allAgents: true,
    method: 'POST',
    body: { locationName, pluginName },
  });
}

export default getDatasetSchema;
