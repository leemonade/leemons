import { Context } from '@leemons/deployment-manager';

interface LeemonsErrorOptions {
  message: string;
  httpStatusCode?: number;
  customCode?: string;
  allowedPermissions?: string[];
  ignoreStack?: boolean;
  [key: string]: any;
}

declare class LeemonsError extends Error {
  constructor(ctx: Context, options: LeemonsErrorOptions);
}

export { LeemonsError, LeemonsErrorOptions };
