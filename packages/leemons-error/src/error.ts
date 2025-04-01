import { getPluginNameFromCTX } from '@leemons/service-name-parser';
import _ from 'lodash';
import { Context, Errors } from 'moleculer';

export interface LeemonsErrorOptions {
  message: string;
  httpStatusCode?: number;
  customCode?: string;
  allowedPermissions?: string[];
  ignoreStack?: boolean;
  [key: string]: any;
}

function errorMessage(message: string): string {
  return `[LeemonsError] - ${message}`;
}

export class LeemonsError extends Errors.MoleculerError {
  constructor(
    ctx: Context,
    {
      message,
      httpStatusCode,
      customCode,
      allowedPermissions,
      ignoreStack,
      ...rest
    }: LeemonsErrorOptions
  ) {
    if (!ctx) {
      throw new Error(errorMessage('ctx field is required'));
    }
    if (!ctx.service?.name) {
      throw new Error(errorMessage('ctx must be a valid moleculer context'));
    }
    if (!message) {
      throw new Error(errorMessage('message field is required'));
    }

    const data = {
      pluginName: getPluginNameFromCTX(ctx),
      pluginVersion: ctx.service.version,
      httpStatusCode,
      code: customCode,
      allowedPermissions,
      ignoreStack,
    };

    if (httpStatusCode) {
      super(message, httpStatusCode, 'LEEMONS_ERROR', data);
    } else {
      super(message, 400, 'LEEMONS_ERROR', data);
    }
    _.forIn(rest, (value, key) => {
      (this as any)[key] = value;
    });
  }
}
