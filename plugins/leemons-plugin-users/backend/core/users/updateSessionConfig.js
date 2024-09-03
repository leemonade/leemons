const _ = require('lodash');
const { addSessionConfigToToken } = require('./jwt/addSessionConfigToToken');

async function updateSessionConfig({ ctx }) {
  const { authorization } = ctx.meta;

  const newTokens = await addSessionConfigToToken({
    token: authorization,
    sessionConfig: ctx.params,
    ctx,
  });

  if (Array.isArray(authorization)) {
    return _.map(authorization, (token, i) => ({ old: token, new: newTokens[i] }));
  }

  return [{ old: authorization, new: newTokens }];
}

module.exports = { updateSessionConfig };
