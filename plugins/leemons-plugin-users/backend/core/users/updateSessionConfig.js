const _ = require('lodash');
const { addSessionConfigToToken } = require('./jwt/addSessionConfigToToken');

async function updateSessionConfig({ ctx }) {
  const newTokens = await addSessionConfigToToken({
    token: ctx.meta.authorization,
    sessionConfig: ctx.params,
    ctx,
  });
  return _.map(ctx.meta.authorization, (token, i) => ({ old: token, new: newTokens[i] }));
}

module.exports = { updateSessionConfig };
