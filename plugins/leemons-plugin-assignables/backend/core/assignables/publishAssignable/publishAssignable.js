const { pick } = require('lodash');
const { LeemonsError } = require('leemons-error');
const {
  validateAssignable,
  validAssignableProperties,
} = require('../../../validations/validateAssignable');
const { updateAsset } = require('../../leebrary/assets');
const { getUserPermission } = require('../../permissions/users/getUserPermission');
const { getAssignable } = require('../getAssignable');

function validateAssignableForPublish({ assignable, ctx }) {
  if (assignable.isDeleted) {
    throw new LeemonsError(ctx, { message: 'The assignable is deleted', httpStatusCode: 404 });
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
      throw new LeemonsError(ctx, { message: 'You do not have permissions', httpStatusCode: 403 });
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
