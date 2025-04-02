import { LeemonsError } from '@leemons/error';
import { AnyContext } from '@leemons/moleculer';

export function getAutoDeploymentIDIfCanIFNotThrowError(ctx: AnyContext): string {
  if (process.env.DISABLE_AUTO_INIT !== 'true') {
    return process.env.AUTO_INIT_DEPLOYMENT_ID ?? 'auto-deployment-id';
  }
  throw new LeemonsError(ctx, { message: 'No deploymentID found' });
}
