import { isLRN } from '@leemons/lrn';
import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import _ from 'lodash';

import { localeRegex } from './validations/localeCode';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addKeywords(ajv);

export class LeemonsValidator {
  public validate: ValidateFunction;
  public schema: object;
  static ajv: Ajv = ajv;

  constructor(schema: object, options?: unknown) {
    if (options) {
      const aj = new Ajv({ ...options, allErrors: true });
      addFormats(aj);
      this.validate = aj.compile(schema);
    } else {
      this.validate = ajv.compile(schema);
    }

    this.schema = schema;
  }

  get error(): Error {
    return new Error(this.errorMessage);
  }

  get errorMessage(): string {
    return _.map(
      _.uniqBy(this.validate.errors as ErrorObject[], 'message'),
      (error: ErrorObject) => `"${error.instancePath}": ${error.message}`
    ).join('\n');
  }

  get ajvError(): ErrorObject[] | null | undefined {
    return this.validate.errors;
  }
}

// Custom type validations
ajv.addFormat('localeCode', {
  validate: (x: string) => localeRegex.test(x),
});

ajv.addFormat('lrn', {
  validate: isLRN,
});
