const { LeemonsError } = require('@leemons/error');
const { flatten } = require('lodash');

const { validateValidateStaffChange } = require('../../validations/forms');

async function validateStaffChange({ data, ctx }) {
  validateValidateStaffChange(data);

  let allResults = [];
  try {
    // Expected response: { status: 'ko' || 'ok', error: { message: 'Error message', code: 'CODE' } };
    allResults = await ctx.tx.emit('validate-staff-change', {
      data,
    });
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: 'Error validating staff change: ' + error.message,
      customCode: 'VALIDATE_STAFF_CHANGE_DENIED',
    });
  }

  const responses = flatten(allResults).filter((response) => response);

  if (responses.length > 0) {
    responses.forEach((response) => {
      if (response.status === 'ko') {
        throw new LeemonsError(ctx, {
          message: response.error.message,
          customCode: 'VALIDATE_STAFF_CHANGE_DENIED',
        });
      }
    });
  }

  return true;
}

module.exports = { validateStaffChange };
