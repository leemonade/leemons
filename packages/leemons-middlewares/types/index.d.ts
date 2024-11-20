import { Context, ServiceSchema } from '@leemons/deployment-manager';

type Action = 'create' | 'view' | 'update' | 'delete' | 'admin';

export type PermissionsForMiddleware<A extends string = never> = {
  [key: string]: { actions: (Action | A)[] };
};

export function LeemonsMiddlewaresMixin(): ServiceSchema;

export function LeemonsMiddlewareAuthenticated(): (ctx: Context) => void;
export function LeemonsMiddlewareAuthenticated({
  continueEvenThoughYouAreNotLoggedIn,
}: {
  continueEvenThoughYouAreNotLoggedIn: boolean;
}): (ctx: Context) => void;

export function LeemonsMiddlewareNecessaryPermits<A = never>({
  allowedPermissions,
}: {
  allowedPermissions: PermissionsForMiddleware<A>;
}): (ctx: Context) => void;

export function checkRequiredPermissions<A = never>({
  allowedPermissions,
  ctx,
}: {
  allowedPermissions: PermissionsForMiddleware<A>;
  ctx: Context;
}): Promise<boolean>;
