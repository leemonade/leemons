const emailService = require('./src/services/email');

async function install() {
  await emailService.init();
  leemons.log.info('Plugin emails init OK');
}

module.exports = install;
