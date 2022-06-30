const _ = require('lodash');
const { addSessionConfigToToken } = require('./jwt/addSessionConfigToToken');

async function updateSessionConfig(ctx, { transacting } = {}) {
  const newTokens = await addSessionConfigToToken(ctx.state.authorization, ctx.request.body);
  return _.map(ctx.state.authorization, (token, i) => ({ old: token, new: newTokens[i] }));
}

module.exports = { updateSessionConfig };
