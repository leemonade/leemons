const { LeemonsError } = require('@leemons/error');
const { removeAssignables } = require('../removeAssignables');

/**
 * Removes an assignable object based on the provided parameters.
 *
 * @async
 * @function removeAssignable
 * @param {Object} params - The parameters for removing the assignable.
 * @param {AssignablesAssignable} params.assignable - The assignable object to remove.
 * @param {number} params.removeAll - Defines the scope of the removal:
 *   0: Only remove the provided version.
 *   1: Remove the versions in the same publish state.
 *   2: Remove all the versions.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Promise<Object>} The result of the removal operation, including the count of removed assignables and their versions.
 *
 * @example
 * // Only remove the provided version
 * removeAssignable({assignable, removeAll: 0, ctx});
 *
 * @example
 * // Remove all the versions in the same publish state
 * removeAssignable({assignable, removeAll: 1, ctx});
 *
 * @example
 * // Remove all the versions
 * removeAssignable({assignable, removeAll: 2, ctx});
 */
async function removeAssignable({ assignable, removeAll = 2, ctx }) {
  const version = await ctx.tx.call('common.versionControl.getVersion', {
    id: assignable,
  });
  const isPublished = version.published;

  if (removeAll === 0) {
    return {
      count: await removeAssignables({ ids: [assignable], ctx }),
      versions: [version.fullId],
    };
  }

  if (removeAll === 1 || removeAll === 2) {
    const versions = await ctx.tx.call('common.versionControl.listVersions', {
      id: assignable,
      published: removeAll === 1 ? isPublished : 'all',
    });

    const versionsIds = versions.map(({ fullId }) => fullId);

    const result = await removeAssignables({ ids: versionsIds, ctx });

    return {
      count: result,
      versions: versionsIds,
    };
  }

  throw new LeemonsError(ctx, {
    message: 'Cannot remove assignable: invalid removeAll value, only 0, 1 or 2 are valid',
    httpStatusCode: 401,
  });
}

module.exports = { removeAssignable };
