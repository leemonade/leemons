const {
  Validators,
  Errors: { ValidationError },
} = require('moleculer');

const Validator = require('fastest-validator');

const _ = require('lodash');

class ControllerValidator extends Validators.Base {
  constructor(opts) {
    super(opts);
    this.validator = new Validator(this.opts);
  }

  /**
   * Compile a validation schema to a checker function.
   * Need a clone because FV manipulate the schema (removing $$... props)
   *
   * @param {any} schema
   * @returns {Function}
   */
  compile(schema) {
    const moleculerSchema = this.convertSchemaToMoleculer(schema);
    return this.validator.compile(_.cloneDeep(moleculerSchema));
  }

  /**
   * Validate params against the schema
   * @param {any} params
   * @param {any} schema
   * @returns {boolean}
   */
  validate(params, schema) {
    const res = this.validator.validate(params, _.cloneDeep(schema));
    if (res !== true) throw new ValidationError('Parameters validation error!', null, res);

    return true;
  }

  /**
   * Convert the specific validation schema to
   * the Moleculer (fastest-validator) validation schema format.
   *
   * @param {any} schema
   * @returns {Object}
   */
  // eslint-disable-next-line class-methods-use-this
  convertSchemaToMoleculer(ajvSchema) {
    if (!ajvSchema.properties) return {};

    const fastestSchema = {};
    Object.keys(ajvSchema.properties).forEach((key) => {
      fastestSchema[key] = { type: ajvSchema.properties[key].type };
      if (ajvSchema.required.includes(key)) {
        fastestSchema[key].optional = false;
      } else {
        fastestSchema[key].optional = true;
      }
    });
    return fastestSchema;
  }
}

module.exports = { ControllerValidator };
