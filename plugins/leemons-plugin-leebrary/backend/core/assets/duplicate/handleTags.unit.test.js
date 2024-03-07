const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleTags } = require('./handleTags');
const getAssets = require('../../../__fixtures__/getAssets');

const { bookmarkAsset } = getAssets();

it('Should retrieve an array of tags associated to the particular asset', async () => {
  // Arrange
  const getValuesTags = fn(() => [['Leemons'], 'wrong']);

  const ctx = generateCtx({
    actions: {
      'common.tags.getValuesTags': getValuesTags,
    },
  });

  const expectedResponse = [...bookmarkAsset.tags];

  // Act
  const response = await handleTags({ assetId: bookmarkAsset.id, ctx });

  // Assert
  expect(getValuesTags).toBeCalledWith({
    values: bookmarkAsset.id,
    type: ctx.prefixPN(''),
  });
  expect(response).toEqual(expectedResponse);
});
