/**
 * Handles the asset tags updates.
 * It removes all existing tags for the asset and sets new tags.
 *
 * @param {Object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Object} params.updateObject - The object containing the new tags.
 * @param {object} params.ctx - The context object containing transaction and user session information.
 * @returns {Promise<void>} Resolves when the tags are updated.
 */
async function handleTagsUpdates({ assetId, updateObject, ctx }) {
  const tagsType = ctx.prefixPN('');

  await ctx.tx.call('common.tags.removeAllTagsForValues', {
    type: tagsType,
    values: assetId,
  });

  await ctx.tx.call('common.tags.setTagsToValues', {
    type: tagsType,
    tags: updateObject.tags,
    values: assetId,
  });
}

module.exports = { handleTagsUpdates };
