const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

function handleUnauthorizedAccess(
  ctx,
  continueEvenThoughYouAreNotLoggedIn,
  message = 'Authorization required'
) {
  if (continueEvenThoughYouAreNotLoggedIn) {
    ctx.meta.userSession = null;
    return;
  }
  throw new LeemonsError(ctx, { httpStatusCode: 401, message, ignoreStack: true });
}

async function authenticateWithToken(ctx, token, forceOnlyUser) {
  const user = await ctx.tx.call('users.auth.detailForJWT', {
    jwtToken: token,
    forceOnlyUser,
  });
  if (user) {
    ctx.meta.userSession = user;
  }
  return user;
}

async function authenticateWithMultipleTokens(ctx) {
  ctx.meta.authorization = _.compact(ctx.meta.authorization);
  const user = await authenticateWithToken(ctx, ctx.meta.authorization[0], true);
  const userAgents = await Promise.all(
    _.map(ctx.meta.authorization, (auth) =>
      ctx.tx.call('users.auth.detailForJWT', {
        jwtToken: auth,
        forceOnlyUser: false,
        forceOnlyUserAgent: true,
      })
    )
  );
  if (user && userAgents.length) {
    user.userAgents = userAgents;
    ctx.meta.userSession = user;
    return user;
  }
  return null;
}

async function authenticateUser(ctx) {
  if (_.isString(ctx.meta.authorization)) {
    return authenticateWithToken(ctx, ctx.meta.authorization, false);
  }

  if (_.isArray(ctx.meta.authorization) && ctx.meta.authorization.length) {
    return authenticateWithMultipleTokens(ctx);
  }

  return null;
}

module.exports =
  ({ continueEvenThoughYouAreNotLoggedIn } = {}) =>
  async (ctx) => {
    if (ctx.meta.userSession) {
      return;
    }
    if (!ctx.meta.authorization) {
      handleUnauthorizedAccess(
        ctx,
        continueEvenThoughYouAreNotLoggedIn,
        '[LeemonsMiddlewareAuthenticated] No authorization header'
      );
      return;
    }

    try {
      const user = await authenticateUser(ctx);
      if (!user) {
        handleUnauthorizedAccess(ctx, continueEvenThoughYouAreNotLoggedIn);
      }
    } catch (err) {
      ctx.logger.error(err);
      handleUnauthorizedAccess(ctx, continueEvenThoughYouAreNotLoggedIn);
    }
  };
