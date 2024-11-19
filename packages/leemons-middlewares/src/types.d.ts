import { Context } from '@leemons/deployment-manager';

interface LeemonsMiddlewareAuthenticatedOptions {
  continueEvenThoughYouAreNotLoggedIn?: boolean;
}

interface LeemonsMiddlewareNecessaryPermitsOptions {
  allowedPermissions?: any;
}

export function LeemonsMiddlewareAuthenticated(
  options?: LeemonsMiddlewareAuthenticatedOptions
): (ctx: Context) => Promise<void>;

export function LeemonsMiddlewareNecessaryPermits(
  options?: LeemonsMiddlewareNecessaryPermitsOptions
): (ctx: Context) => Promise<void>;

export function LeemonsMiddlewaresMixin(): (ctx: Context) => Promise<void>;
