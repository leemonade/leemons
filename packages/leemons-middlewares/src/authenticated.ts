import { LeemonsError } from '@leemons/error';
import type { Context } from '@leemons/moleculer';
import type { UserAgent, UserSession } from '@leemons/users';
import _ from 'lodash';
import type { LeemonsMiddleware, LeemonsMiddlewareAuthenticatedOptions } from './types';

function handleUnauthorizedAccess(
  ctx: Context,
  continueEvenThoughYouAreNotLoggedIn?: boolean,
  message = 'Authorization required'
): void {
  if (continueEvenThoughYouAreNotLoggedIn) {
    ctx.meta.userSession = null;
    return;
  }
  throw new LeemonsError(ctx, {
    httpStatusCode: 401,
    message,
    ignoreStack: true,
  });
}

async function authenticateWithToken(
  ctx: Context,
  token: string,
  forceOnlyUser: boolean
): Promise<UserSession | null> {
  const user = (await ctx.tx.call('users.auth.detailForJWT', {
    jwtToken: token,
    forceOnlyUser,
  })) as UserSession | null;
  if (user) {
    ctx.meta.userSession = user;
  }
  return user;
}

async function authenticateWithMultipleTokens(ctx: Context): Promise<UserSession | null> {
  ctx.meta.authorization = _.compact(ctx.meta.authorization);
  const user = await authenticateWithToken(ctx, ctx.meta.authorization[0], true);
  const userAgents = await Promise.all(
    _.map(
      ctx.meta.authorization,
      (auth) =>
        ctx.tx.call('users.auth.detailForJWT', {
          jwtToken: auth,
          forceOnlyUser: false,
          forceOnlyUserAgent: true,
        }) as Promise<UserAgent>
    )
  );
  if (user && userAgents.length) {
    user.userAgents = userAgents.filter((ua) => !!ua);
    ctx.meta.userSession = user;
    return user;
  }
  return null;
}

async function authenticateUser(ctx: Context): Promise<UserSession | null> {
  if (_.isString(ctx.meta.authorization)) {
    return authenticateWithToken(ctx, ctx.meta.authorization, false);
  }

  if (_.isArray(ctx.meta.authorization) && ctx.meta.authorization.length) {
    return authenticateWithMultipleTokens(ctx);
  }

  return null;
}

export const LeemonsMiddlewareAuthenticated = ({
  continueEvenThoughYouAreNotLoggedIn,
}: LeemonsMiddlewareAuthenticatedOptions = {}): LeemonsMiddleware => {
  return async (ctx: Context): Promise<void> => {
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
};
