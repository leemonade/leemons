async function removeDatasetField(locationName, pluginName, item) {
  return leemons.api(
    {
      url: 'dataset/remove-field',
      allAgents: true,
    },
    {
      method: 'POST',
      body: { locationName, pluginName, item },
    }
  );
}

export default removeDatasetField;
