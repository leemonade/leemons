const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addKeywords = require('ajv-keywords');

const {
  Validators,
  Errors: { ValidationError },
} = require('moleculer');

class ControllerValidator extends Validators.Base {
  constructor(options = {}) {
    super();
    this.validator = new Ajv({ ...options, allErrors: true });

    addKeywords(this.validator);
    addFormats(this.validator);
    this.fallbackValidator = new Validators.Fastest();
  }

  compile(schema) {
    const validate = this.validator.compile(schema);
    return (params) => this.validate(params, validate);
  }

  // eslint-disable-next-line class-methods-use-this
  async validate(params, validate) {
    const isValid = await validate(params);
    if (!isValid) throw new ValidationError('Parameters validation error!', null, validate.errors);
    return isValid;
  }

  /**
   * Register validator as a middleware
   *
   * @memberof ParamValidator
   */
  middleware() {
    const self = this;

    const processCheckResponse = function check(ctx, handler, res) {
      if (res === true) return handler(ctx);
      return Promise.reject(new ValidationError('Parameters validation error!', null, res));
    };

    return {
      name: 'Validator',
      localAction: function validatorMiddleware(handler, action) {
        if (!action.params?.properties || typeof action.params?.properties !== 'object') {
          // no schema to validate for => just return back the handler directly
          if (!action.params || typeof action.params !== 'object') return handler;

          // fallback to the fastest validator (moleculer's default validator)
          const checkFn = self.fallbackValidator.compile(action.params);
          return async function validateContextParams(ctx) {
            const res = await checkFn(ctx.params);
            if (res !== true) return processCheckResponse(ctx, handler, res);
            return handler(ctx);
          };
        }

        // Wrap a param validator when the params are specified
        const checkFn = self.compile(action.params);
        return async function validateContextParams(ctx) {
          const res = await checkFn(ctx.params != null ? ctx.params : {});
          if (res !== true) return processCheckResponse(ctx, handler, res);
          return handler(ctx);
        };
      },
    };
  }
}

module.exports = { ControllerValidator };
