async function saveDatasetMultipleFields(locationName, pluginName, fields) {
  return leemons.api('v1/dataset/dataset/save-multiple-fields', {
    allAgents: true,
    method: 'POST',
    body: { locationName, pluginName, fields },
  });
}

export default saveDatasetMultipleFields;
