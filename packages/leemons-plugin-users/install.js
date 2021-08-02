const actionsService = require('./src/services/actions');
const permissionService = require('./src/services/permissions');
const userService = require('./src/services/users');
const { addMain, addWelcome, addProfiles } = require('./src/services/menu-builder');
const _ = require('lodash');
const constants = require('./config/constants');
const recoverEmail = require('./emails/recoverPassword');
const resetPassword = require('./emails/resetPassword');

async function install() {
  await actionsService.init();
  leemons.events.emit('init-actions');
  await permissionService.init();
  leemons.events.emit('init-permissions');
  await userService.init();
}

module.exports = install;
