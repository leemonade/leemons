const userService = require('./src/services/users');

async function install() {
  await userService.init();
}

module.exports = install;
