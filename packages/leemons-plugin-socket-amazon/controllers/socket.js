const socketService = require('../src/services/socket');

async function getCredentials(ctx) {
  const credentials = await socketService.createCredentialsForUserSession(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, credentials };
}

async function setConfig(ctx) {
  const config = await socketService.setConfig(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

async function getConfig(ctx) {
  const config = await socketService.getConfig(ctx.request.body);
  if (config) delete config.secretAccessKey;
  ctx.status = 200;
  ctx.body = { status: 200, config };
}

module.exports = {
  getCredentials,
  setConfig,
  getConfig,
};
