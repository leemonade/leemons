import { Context, Errors } from 'moleculer';

interface LeemonsErrorOptions {
  message: string;
  httpStatusCode?: number;
  customCode?: string;
  allowedPermissions?: string[];
  ignoreStack?: boolean;
  [key: string]: unknown;
}

declare class LeemonsError extends Errors.MoleculerError {
  constructor(ctx: Context, options: LeemonsErrorOptions);
}

export { LeemonsError, LeemonsErrorOptions };
