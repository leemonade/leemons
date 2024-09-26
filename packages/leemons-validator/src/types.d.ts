import { ErrorObject } from 'ajv';

export class LeemonsValidator {
  constructor(schema: object, options?: object);
  validate: (data: any) => boolean;
  schema: object;
  readonly error: Error;
  readonly errorMessage: string;
  readonly ajvError: ErrorObject[] | null | undefined;
  static ajv: Ajv;
}

export type StringSchema = {
  type: 'string';
  minLength: number;
  maxLength: number;
};

export type TextSchema = {
  type: 'string';
  minLength: number;
  maxLength: number;
};

export type ArrayStringRequiredSchema = {
  type: 'array';
  items: {
    type: 'string';
  };
  minItems: number;
};

export type ValidateSchema = {
  text: TextSchema;
  string: StringSchema;
  arrayStringRequired: ArrayStringRequiredSchema;
};

export const localeRegexString = `^([a-z]{2,3})(-[a-z]{4}){0,1}(-([a-z]{2}|[0-9]{3})){0,1}$`;
