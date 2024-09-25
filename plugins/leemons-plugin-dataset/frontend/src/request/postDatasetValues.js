async function postDatasetValues({ locationName, pluginName, targetId, values }) {
  return leemons.api(`v1/dataset/dataset/values/${pluginName}/${locationName}/${targetId}`, {
    allAgents: true,
    method: 'POST',
    body: {
      values,
    },
  });
}

export default postDatasetValues;
