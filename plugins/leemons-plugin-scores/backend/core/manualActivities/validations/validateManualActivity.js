const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');

const { manualActivitySchema } = require('./schema');

function validateManualActivity({ ctx, manualActivity }) {
  const validator = new LeemonsValidator(manualActivitySchema);

  if (!validator.validate(manualActivity)) {
    throw new LeemonsError(ctx, {
      message: validator.errorMessage,
      httpStatusCode: 400,
      customCode: 'INVALID_MANUAL_ACTIVITY',
    });
  }
}

module.exports = {
  validateManualActivity,
};
