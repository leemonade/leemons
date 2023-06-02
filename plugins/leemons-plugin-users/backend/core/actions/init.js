const constants = require('../../config/constants');
const { addMany } = require('./addMany');

/**
 * Creates the default actions that come with the leemons app
 * @public
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * */
async function init({ ctx }) {
  return addMany({ data: constants.defaultActions, ctx });
}

module.exports = { init };
