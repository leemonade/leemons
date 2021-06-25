const constants = require('../config/constants');

setTimeout(() => {
  (async () => {
    try {
      const data = await leemons.plugins.dataset.services.dataset.addLocation({
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
    } catch (e) {
      console.error('Añadir localizacion');
      console.error(e.message);
    }

    try {
      const data = await leemons.plugins.dataset.services.dataset.getLocation(
        'user-dataset',
        constants.pluginName,
        { locale: 'en' }
      );
      console.log(data);
    } catch (e) {
      console.error('Coger localizacion');
      console.error(e.message);
    }
  })();
}, 1000);

module.exports = {};
