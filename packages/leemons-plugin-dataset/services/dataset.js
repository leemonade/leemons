const constants = require('../config/constants');
const datasetService = require('../src/services/dataset');
const datasetLocationService = require('../src/services/dataset-location');

setTimeout(async () => {
  const data = await datasetLocationService.addLocation({
    name: {
      'es-ES': 'Usuarios',
      en: 'Users',
    },
    description: {
      'es-ES': 'Añade datos adicionales a los usuarios',
      en: 'Adds additional data to users',
    },
    locationName: 'user-dataset',
    pluginName: constants.pluginName,
  });
  console.log(data);
}, 1000);
module.exports = {};
