const emailService = require('./src/services/email');

async function init() {
  await emailService.init();
  leemons.log.info('Plugin emails init OK');
}

module.exports = init;
