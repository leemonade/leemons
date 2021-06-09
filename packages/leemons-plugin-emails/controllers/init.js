const emailService = require('../services/private/email');

async function init(ctx) {
  // TODO Borrar todo lo del init una vez tengamos una manera de inicializar los plugins
  await emailService.init();
  ctx.body = { email: 'ok' };
}

async function testSend(ctx) {
  // TODO Borrar todo lo del init una vez tengamos una manera de inicializar los plugins
  await emailService.send('leemons@leemons.io', 'cerberupo@gmail.com', 'test-mail', 'en', 'es', {
    name: 'Juanito',
  });
  ctx.body = { email: 'ok' };
}

module.exports = {
  init,
  testSend,
};
