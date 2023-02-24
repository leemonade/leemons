const socketService = require('../src/services/socket');

async function getCredentials(ctx) {
  const credentials = await socketService.createCredentialsForUserSession(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, credentials };
}

module.exports = {
  getCredentials,
};
