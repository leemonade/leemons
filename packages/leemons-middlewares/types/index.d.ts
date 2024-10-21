import { Context, ServiceSchema } from '@leemons/deployment-manager';

type Action = 'create' | 'view' | 'update' | 'delete' | 'admin';

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

export function checkRequiredPermissions({
  allowedPermissions,
  ctx,
}: {
  allowedPermissions: PermissionsForMiddleware;
  ctx: Context;
}): Promise<boolean>;
