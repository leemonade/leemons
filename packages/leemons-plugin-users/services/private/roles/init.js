const _ = require('lodash');
const { add } = require('./add');

const constants = require('../../../config/constants');

/**
 * Creates the default roles that come with the leemons app
 * @public
 * @static
 * */
async function init() {
  await Promise.all(_.map(constants.defaultRoles, (role) => add(role)));
}

module.exports = { init };
