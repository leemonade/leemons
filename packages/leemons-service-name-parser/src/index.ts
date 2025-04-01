import { Context } from 'moleculer';

/**
 * Removes the version prefix from an action name if it exists
 */
export function getActionWithOutVersion(actionName: string): string {
  const sp = actionName.split('.');
  if (/^v\d+$/.test(sp[0])) {
    sp.shift();
    return sp.join('.');
  }
  return actionName;
}

/**
 * Extracts the plugin version from a service name if it exists
 */
export function getPluginVersionFromServiceName(serviceName: string): string | null {
  const sp = serviceName.split('.');
  if (/^v\d+$/.test(sp[0])) {
    return sp[0];
  }
  return null;
}

/**
 * Extracts the plugin name from a service name
 */
export function getPluginNameFromServiceName(serviceName: string): string {
  const sp = serviceName.split('.');
  if (/^v\d+$/.test(sp[0])) {
    return sp[1];
  }
  return sp[0];
}

/**
 * Gets the plugin name with version prefix if it exists
 */
export function getPluginNameWithVersionIfHaveFromServiceName(serviceName: string): string {
  const sp = serviceName.split('.');
  if (/^v\d+$/.test(sp[0])) {
    return `${sp[0]}.${sp[1]}`;
  }
  return sp[0];
}

/**
 * Extracts the plugin name from a Moleculer context
 */
export function getPluginNameFromCTX(ctx: Context): string {
  if (!ctx?.service?.name) {
    throw new Error(
      '[leemons-service-name-parser - getPluginNameFromCTX] - ctx not a valid moleculer context'
    );
  }
  return getPluginNameFromServiceName(ctx.service.name);
}

/**
 * Extracts the action name from a Moleculer context
 */
export function getActionNameFromCTX(ctx: Context): string {
  if (!ctx?.service?.fullName || !ctx?.action?.name) {
    throw new Error(
      '[leemons-service-name-parser - getActionNameFromCTX] - ctx not a valid moleculer context'
    );
  }
  return ctx.action.name.replace(`${ctx.service.fullName}.`, '');
}
