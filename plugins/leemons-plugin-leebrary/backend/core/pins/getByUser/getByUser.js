/**
 * Gets the pins by user.
 *
 * @param {Object} params - The parameters object.
 * @param {Context} params.ctx - The Moleculer context object.
 * @returns {Promise<LibraryPin[]>} A promise that resolves with the found pin documents.
 */
async function getByUser({ ctx }) {
  return ctx.tx.db.Pins.find({ userAgent: ctx.meta.userSession.userAgents[0].id });
}

module.exports = { getByUser };
