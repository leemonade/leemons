import { LeemonsError } from '@leemons/error';
import type { AnyContext } from '@leemons/moleculer';
import { forIn } from 'lodash';
import type { PermissionsForMiddleware } from '../types';

interface CheckRequiredPermissionsParams {
  allowedPermissions: PermissionsForMiddleware;
  ctx: AnyContext;
}

export async function checkRequiredPermissions({
  allowedPermissions,
  ctx,
}: CheckRequiredPermissionsParams): Promise<boolean> {
  if (ctx.meta.userSession) {
    const hasPermission = await ctx.tx.call('users.auth.hasPermissionCTX', {
      allowedPermissions,
    });

    if (hasPermission) {
      return true;
    }
  }

  const rAllowedPermissions: Array<{
    permissionName: string;
    actions: string[];
  }> = [];
  forIn(allowedPermissions, ({ actions }, permissionName) => {
    rAllowedPermissions.push({ permissionName, actions });
  });
  throw new LeemonsError(ctx, {
    httpStatusCode: 401,
    message: 'You do not have permissions',
    allowedPermissions: rAllowedPermissions,
  });
}
