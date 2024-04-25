const { pick } = require('lodash');
const { getAssignable } = require('../getAssignable');
const { validAssignableProperties } = require('../../../validations/validateAssignable');
const { createAssignable } = require('../createAssignable');

/**
 * Duplicates an assignable based on the provided id and other parameters.
 * It fetches the assignable to duplicate, modifies its name, and creates a new assignable with the duplicated data.
 * If the published parameter is not provided, the new assignable is not published.
 *
 * @async
 * @function duplicateAssignable
 * @param {Object} params - The main parameter object.
 * @param {string} params.id - The id of the assignable to duplicate.
 * @param {boolean} params.published - Flag to publish the new assignable. Defaults to false.
 * @param {boolean} params.ignoreSubjects - Flag to ignore subjects. Defaults to false.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesAssignable>} The duplicated assignable.
 * @throws {LeemonsError} If the assignable does not exist or the user does not have access to it, a LeemonsError is thrown.
 */
async function duplicateAssignable({ assignableId: id, published, ignoreSubjects, ctx }) {
  const assignable = await getAssignable({
    id,
    ctx,
  });
  assignable.asset.name += ' (1)';

  const assignableToCreate = pick(assignable, validAssignableProperties);

  if (ignoreSubjects) {
    assignableToCreate.subjects = [];
  }

  return createAssignable({
    assignable: assignableToCreate,
    published: published === undefined ? false : published,
    ctx,
  });
}

module.exports = { duplicateAssignable };
