const emailService = require('./services/private/email');

async function init() {
  await emailService.init();
  leemons.log.info('Plugin emails init OK');
}

module.exports = init;
