const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');

const { retakeSchema } = require('./schema');

function validateRetake({ ctx, retake }) {
  const validator = new LeemonsValidator(retakeSchema);

  if (!validator.validate(retake)) {
    throw new LeemonsError(ctx, {
      message: validator.errorMessage,
      httpStatusCode: 400,
      customCode: 'INVALID_RETAKE',
    });
  }
}

module.exports = validateRetake;
