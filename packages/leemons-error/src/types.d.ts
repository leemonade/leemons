import { Errors, Context } from 'moleculer';

// eslint-disable-next-line import/prefer-default-export
export declare class LeemonsError extends Errors.MoleculerError {
  constructor(ctx: Context, options: { message: string; httpStatusCode: number });
}
