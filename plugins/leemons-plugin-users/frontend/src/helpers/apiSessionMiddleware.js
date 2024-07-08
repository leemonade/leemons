import _ from 'lodash';
import { getCookieToken } from '@users/session';

function setAuthorizationHeader(ctx, token) {
  ctx.options.headers.Authorization = token;
}

function handleMultipleTokens(ctx, token) {
  if (token.centers.length === 1) {
    setAuthorizationHeader(ctx, token.centers[0].token);
  } else if (ctx.options.allAgents) {
    const allTokens = _.compact(token.centers.concat(token.profiles));
    setAuthorizationHeader(ctx, JSON.stringify(_.map(allTokens, 'token')));
  } else if (ctx.options.centerToken) {
    setAuthorizationHeader(ctx, ctx.options.centerToken);
  } else if (ctx.options.profileAgents) {
    setAuthorizationHeader(ctx, JSON.stringify(_.map(token.profiles, 'token')));
  } else {
    setAuthorizationHeader(ctx, token.userToken);
  }
}

function apiSessionMiddleware(ctx) {
  if (!ctx.options) ctx.options = {};
  if (ctx.options && !ctx.options.headers) ctx.options.headers = {};

  const token = getCookieToken(true);

  if (token && !ctx.options.headers.Authorization) {
    if (_.isString(token)) {
      setAuthorizationHeader(ctx, token);
    } else {
      handleMultipleTokens(ctx, token);
    }
  }
}

export { apiSessionMiddleware };
