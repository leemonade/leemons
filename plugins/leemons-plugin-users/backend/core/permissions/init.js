const constants = require('../../../config/constants');

// TODO HACER EL ADD MANY DIRECTAMENTE EN LA INSTALACION DE UN NUEVO DESPLIEGUE EN LUGAR DE TENER ESTA FUNCIONA
/**
 * Creates the default permissions that come with the leemons app
 * @public
 * @static
 * */
async function init() {
  await leemons.plugin.services.permissions.addMany(constants.defaultPermissions);
}

module.exports = { init };
