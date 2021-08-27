async function getDatasetSchemaLocale(locationName, pluginName, locale) {
  return leemons.api(
    {
      url: 'dataset/get-schema-locale',
      allAgents: true,
    },
    {
      method: 'POST',
      body: { locationName, pluginName, locale },
    }
  );
}

export default getDatasetSchemaLocale;
