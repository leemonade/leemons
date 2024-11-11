const { LeemonsError } = require('@leemons/error');
const { flatten } = require('lodash');

const { validateValidateStaffChange } = require('../../validations/forms');

/**
 * Validates if a staff change is allowed by emitting a validation event and checking responses
 *
 * @param {Object} params - The parameters object
 * @param {Object} params.data - The staff change data to validate
 * @param {Object} params.ctx - The moleculer context object
 * @returns {Promise<boolean>} Returns true if validation passes, throws error if denied
 * @throws {LeemonsError} Throws error if any validator denies the staff change
 */

async function validateStaffChange({ data, ctx }) {
  validateValidateStaffChange(data);
  let allResults = [];

  //! Expected response: { status: 'ko' || 'ok', error: { message: 'Error message in user locale' } };
  //! This event cannot be handled by a multi-event listener
  allResults = await ctx.tx.emit('validate-staff-change', {
    data,
  });

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
