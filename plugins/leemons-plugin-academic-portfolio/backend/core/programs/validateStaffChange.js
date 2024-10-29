const { LeemonsError } = require('@leemons/error');
const { flatten } = require('lodash');

const { validateValidateStaffChange } = require('../../validations/forms');

async function validateStaffChange({ data, ctx }) {
  validateValidateStaffChange(data);

  let results = [];
  try {
    // We expect a boolean value - When an error is thrown through the event handler, it does not get catched here. Instead it arrives as an undefined value. Not explicit enough
    results = await ctx.tx.emit('validate-staff-change', {
      data,
    });
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: 'Error validating staff change: ' + error.message,
      customCode: 'VALIDATE_STAFF_CHANGE_ERROR',
    });
  }

  if (flatten(results).includes(false)) {
    throw new LeemonsError(ctx, {
      message: 'Staff change validation denied',
      customCode: 'VALIDATE_STAFF_CHANGE_DENIED',
    });
  }

  return true;
}

module.exports = { validateStaffChange };
