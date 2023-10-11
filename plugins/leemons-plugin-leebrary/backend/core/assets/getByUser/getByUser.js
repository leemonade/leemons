/**
 * Retrieves assets by user.
 *
 * @async
 * @function getByUser
 * @param {Object} params - An object containing parameters.
 * @param {string} params.userId - The ID of the user.
 * @param {MoleculerContext} params.ctx - The moleculercONTEXT
 * @returns {Promise<Array>} A promise that resolves to an array of assets belonging to the user.
 */
async function getByUser({ userId, ctx }) {
  return ctx.tx.db.Assets.find({ fromUser: userId }).lean();
}

module.exports = { getByUser };
