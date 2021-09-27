const { dataset } = leemons.getPlugin('dataset').services;

module.exports = async function addLocaltion(schemaName, schemaId) {
  const name = {
    en: `LevelSchema "${schemaName}" dataset`,
  };

  const description = {
    en: `This dataset will be used for all your levels with the schema ${schemaName}`,
  };

  const locationName = `levelSchemas-${schemaId}`;

  console.log(dataset);
  try {
    return await dataset.addLocation({
      name,
      description,
      locationName,
      pluginName: 'plugins.classroom',
    });
  } catch (e) {
    console.log(e);
    throw new Error("The dataset location can't be created");
  }
};
