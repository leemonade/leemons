const { describe, expect, it } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleTagsUpdates } = require('./handleTagsUpdates');

describe('handleTagsUpdates', () => {
  it('should update tags correctly', async () => {
    // Arrange
    const assetId = 'testAssetId';
    const updateObject = { tags: ['tag1', 'tag2'] };

    const removeAllTagsForValues = jest.fn();
    const setTagsToValues = jest.fn();
    const ctx = generateCtx({
      actions: {
        'common.tags.removeAllTagsForValues': removeAllTagsForValues,
        'common.tags.setTagsToValues': setTagsToValues,
      },
    });

    // Act
    await handleTagsUpdates({ assetId, updateObject, ctx });

    // Assert
    expect(removeAllTagsForValues).toHaveBeenCalledWith({
      type: ctx.prefixPN(''),
      values: assetId,
    });
    expect(setTagsToValues).toHaveBeenCalledWith({
      type: ctx.prefixPN(''),
      tags: updateObject.tags,
      values: assetId,
    });
  });
});
