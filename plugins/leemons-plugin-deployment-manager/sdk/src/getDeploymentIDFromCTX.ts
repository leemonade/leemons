import type { Context } from "@leemons/moleculer";
import { getAutoDeploymentIDIfCanIFNotThrowError } from "./getAutoDeploymentIDIfCanIFNotThrowError";

export function getDeploymentIDFromCTX(ctx: Context): string {
  if (ctx.meta.deploymentID) {
    return ctx.meta.deploymentID;
  }

  if (ctx.meta.userSession?.deploymentID) {
    return ctx.meta.userSession.deploymentID;
  }

  return getAutoDeploymentIDIfCanIFNotThrowError(ctx);
}
