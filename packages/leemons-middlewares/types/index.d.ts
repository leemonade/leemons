import { Context, ServiceSchema } from '@leemons/deployment-manager';

type Action = 'create' | 'read' | 'update' | 'delete' | 'admin';

type PermissionsForMiddleware = {
  [key: string]: { actions: Action[] };
};

export function LeemonsMiddlewaresMixin(): ServiceSchema;

export function LeemonsMiddlewareAuthenticated(): (ctx: Context) => void;
export function LeemonsMiddlewareAuthenticated({
  continueEvenThoughYouAreNotLoggedIn,
}: {
  continueEvenThoughYouAreNotLoggedIn: boolean;
}): (ctx: Context) => void;

export function LeemonsMiddlewareNecessaryPermits({
  allowedPermissions,
}: {
  allowedPermissions: PermissionsForMiddleware;
}): (ctx: Context) => void;
