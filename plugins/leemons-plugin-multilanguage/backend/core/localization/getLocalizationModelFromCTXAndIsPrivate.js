/**
 * Return Contents model if is private if not return Common model.
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @returns {Promise<Object>} DB Model to use
 */
function getLocalizationModelFromCTXAndIsPrivate({ ctx, isPrivate }) {
  if (isPrivate) return ctx.tx.db.Contents;
  return ctx.tx.db.Common;
}

module.exports = { getLocalizationModelFromCTXAndIsPrivate };
