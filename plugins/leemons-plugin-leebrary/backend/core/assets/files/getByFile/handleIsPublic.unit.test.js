const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleIsPublic } = require('./handleIsPublic');

// MOCKS
jest.mock('../../find');
const { find: findAssets } = require('../../find');

beforeEach(() => jest.resetAllMocks());

it('Returns a boolean indicating wether an asset is public or not', async () => {
  // Arrange
  const mockAssets = [
    { id: 'asset1', public: true },
    { id: 'asset2', public: false },
  ];

  const ctx = generateCtx({});

  // Act
  findAssets.mockResolvedValue([mockAssets[0]]);
  const responseAssetOne = await handleIsPublic({ assetId: mockAssets[0].id, ctx });
  findAssets.mockResolvedValue([mockAssets[1]]);
  const responseAssetTwo = await handleIsPublic({ assetId: mockAssets[1].id, ctx });

  // Assert
  expect(findAssets).nthCalledWith(
    1,
    expect.objectContaining({
      query: { id: mockAssets[0].id },
      ctx,
    })
  );
  expect(findAssets).toBeCalledTimes(2);
  expect(responseAssetOne).toBe(mockAssets[0].public);
  expect(responseAssetTwo).toBe(mockAssets[1].public);
});

it('Should not catch any errors', async () => {
  // Arrange
  const ctx = generateCtx({});

  // Act
  findAssets.mockImplementation(() => {
    throw new Error('Error thrown');
  });
  const testFnToThrow = () => handleIsPublic({ assetId: 'assetId', ctx });

  // Assert
  await expect(testFnToThrow).rejects.toThrow();
});
