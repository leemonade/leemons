const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

module.exports =
  ({ continueEvenThoughYouAreNotLoggedIn } = {}) =>
  async (ctx) => {
    if (ctx.meta.userSession) {
      return;
    }
    if (!ctx.meta.authorization) {
      if (continueEvenThoughYouAreNotLoggedIn) {
        ctx.meta.userSession = null;
        return;
      }

      throw new LeemonsError(ctx, {
        httpStatusCode: 401,
        message: '[LeemonsMiddlewareAuthenticated] No authorization header',
      });
    }

    try {
      if (_.isString(ctx.meta.authorization)) {
        const user = await ctx.tx.call('users.auth.detailForJWT', {
          jwtToken: ctx.meta.authorization,
        });
        if (user) {
          ctx.meta.userSession = user;
          return;
        }
      } else {
        const user = await ctx.tx.call('users.auth.detailForJWT', {
          jwtToken: ctx.meta.authorization[0],
          forceOnlyUser: true,
        });
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
          return;
        }
      }
      if (continueEvenThoughYouAreNotLoggedIn) {
        ctx.meta.userSession = null;
        return;
      }
      throw new LeemonsError(ctx, { httpStatusCode: 401, message: 'Authorization required' });
    } catch (err) {
      ctx.logger.error(err);
      if (continueEvenThoughYouAreNotLoggedIn) {
        ctx.meta.userSession = null;
        return;
      }
      throw new LeemonsError(ctx, { httpStatusCode: 401, message: 'Authorization required' });
    }
  };
