const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');

const { scoresSchema } = require('./schema');

function validateManualActivityScore({ ctx, manualActivityScore }) {
  const validator = new LeemonsValidator(scoresSchema);

  if (!validator.validate(manualActivityScore)) {
    throw new LeemonsError(ctx, {
      message: validator.errorMessage,
      httpStatusCode: 400,
      customCode: 'INVALID_MANUAL_ACTIVITY_SCORE',
    });
  }
}

module.exports = {
  validateManualActivityScore,
};
