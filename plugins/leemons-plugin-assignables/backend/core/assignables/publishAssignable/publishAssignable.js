const { pick } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const {
  validateAssignable,
  validAssignableProperties,
} = require('../../../validations/validateAssignable');
const { updateAsset } = require('../../leebrary/assets');
const { getUserPermission } = require('../../permissions/assignables/users/getUserPermission');
const { getAssignable } = require('../getAssignable');

/**
 * Validates an assignable for publishing.
 * It checks if the assignable is deleted and throws a LeemonsError if it is.
 * It also validates the assignable with the validAssignableProperties.
 *
 * @function validateAssignableForPublish
 * @param {Object} params - The main parameter object.
 * @param {AssignablesAssignable} params.assignable - The assignable to validate.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @throws {LeemonsError} If the assignable is deleted, a LeemonsError is thrown.
 */

function validateAssignableForPublish({ assignable, ctx }) {
  if (assignable.isDeleted) {
    throw new LeemonsError(ctx, {
      message: 'The assignable is deleted',
      httpStatusCode: 404,
    });
  }
  validateAssignable(pick(assignable, validAssignableProperties), {
    useRequired: ['asset', 'role', 'subjects'],
  });
}

async function publishAssignable({ id, ctx }) {
  try {
    // TODO
    const assignable = await getAssignable({ id, ctx });

    validateAssignableForPublish({ assignable, ctx });

    const { actions } = await getUserPermission({ assignableId: id, ctx });

    if (!actions.includes('edit')) {
      throw new LeemonsError(ctx, {
        message: 'You do not have permissions',
        httpStatusCode: 403,
      });
    }

    await updateAsset({ asset: assignable.asset, published: true, ctx });

    await ctx.tx.call('common.versionControl.publishVersion', {
      id,
      publish: true,
      setAsCurrent: true,
    });

    return true;
  } catch (e) {
    e.message = `Cannot publish assignable: ${e.message}`;

    throw e;
  }
}

module.exports = { publishAssignable };
