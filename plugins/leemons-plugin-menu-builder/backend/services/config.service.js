/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const constants = require('../config/constants');
// TODO Migration: Este servicio lo necesito porque requerimos la clave MainMenuKey en el microservicio de academic-portfolio
//! Preguntar a Jaime si es necesario hacerlo, o si se puede hacer de otra forma (meter el parámetro menuKey de determinados métodos de menu-builder con el mainMenuKey por defecto, por ejemplo)
/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'menu-builder.config',
  version: 1,
  actions: {
    constants: {
      handler() {
        return constants;
      },
    },
  },
  created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
});
