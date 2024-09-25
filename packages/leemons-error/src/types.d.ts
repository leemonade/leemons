/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Errors } from 'moleculer';

interface LeemonsErrorOptions {
  message: string;
  httpStatusCode?: number;
  customCode?: string;
  allowedPermissions?: string[];
  ignoreStack?: boolean;
  [key: string]: any;
}

declare class LeemonsError extends Errors.MoleculerError {
  constructor(ctx: Context, options: LeemonsErrorOptions);
}

export { LeemonsError, LeemonsErrorOptions };
