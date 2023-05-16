async function getDatasetSchemaFieldLocale(locationName, pluginName, locale, item) {
  return leemons.api('dataset/get-schema-field-locale', {
    allAgents: true,
    method: 'POST',
    body: { locationName, pluginName, locale, item },
  });
}

export default getDatasetSchemaFieldLocale;
