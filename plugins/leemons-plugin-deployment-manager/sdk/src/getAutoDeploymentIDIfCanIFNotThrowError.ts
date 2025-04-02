import { LeemonsError } from '@leemons/error';
import type { Context } from '@leemons/moleculer';

export function getAutoDeploymentIDIfCanIFNotThrowError(ctx: Context): string {
  if (process.env.DISABLE_AUTO_INIT !== 'true') {
    return process.env.AUTO_INIT_DEPLOYMENT_ID ?? 'auto-deployment-id';
  }
  throw new LeemonsError(ctx, { message: 'No deploymentID found' });
}
