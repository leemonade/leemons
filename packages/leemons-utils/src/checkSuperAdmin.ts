import { LeemonsError } from '@leemons/error';
import type { AnyContext } from '@leemons/moleculer';

interface CheckSuperAdminOptions {
  notThrow?: boolean;
}

/**
 * Checks if the current user is a super admin
 * @param ctx - The context object containing transaction and user session info
 * @param options - Options for the check
 * @param options.notThrow - If true, returns false instead of throwing an error when user is not super admin
 * @returns True if user is super admin, false if notThrow is true and user is not super admin
 * @throws {LeemonsError} If user is not super admin and notThrow is false
 */
async function checkSuperAdmin(
  ctx: AnyContext,
  { notThrow = false }: CheckSuperAdminOptions = {}
): Promise<boolean> {
  const isSuper = await ctx.tx.call('users.users.isSuperAdmin', {
    userId: ctx?.meta?.userSession?.id,
  });

  if (!isSuper) {
    if (notThrow) {
      return false;
    }

    throw new LeemonsError(ctx, {
      message: 'Only super admins can change the organization',
    });
  }

  return true;
}

export { checkSuperAdmin };
