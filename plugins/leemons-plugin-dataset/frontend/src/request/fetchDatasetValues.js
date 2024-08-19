async function fetchDatasetValues({ locationName, pluginName, targetId }) {
  return leemons.api(`v1/dataset/dataset/values/${pluginName}/${locationName}/${targetId}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default fetchDatasetValues;
