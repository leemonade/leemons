const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');

const { retakeScoreSchema } = require('./schema');

function validateRetakeScore({ retakeScore, ctx }) {
  const validator = new LeemonsValidator(retakeScoreSchema);

  if (!validator.validate(retakeScore)) {
    throw new LeemonsError(ctx, {
      message: validator.errorMessage,
      httpStatusCode: 400,
      customCode: 'INVALID_RETAKE_SCORE',
    });
  }
}

module.exports = validateRetakeScore;
