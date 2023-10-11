const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { handlePermissions } = require('./handlePermissions');

// MOCKS
jest.mock('../../../permissions/getByAsset');
const { getByAsset: getPermissions } = require('../../../permissions/getByAsset');

beforeEach(() => jest.resetAllMocks());

it('Should throw when the user is not allowed to edit and flag skipPermissions is falsy', async () => {
  // Arrange
  const mockAssetId = 'assetId';
  const ctx = generateCtx({});

  getPermissions.mockResolvedValue({ permissions: { edit: false } });
  // Act
  try {
    await handlePermissions({
      assetId: mockAssetId,
      skipPermissions: undefined,
      ctx,
    });
  } catch (error) {
    // Assert
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(401);
    expect(error.message).toBe("You don't have permissions to update this asset");
  }
});

it('Does not throw when skipPermissions is true', async () => {
  // Arrange
  const mockAssetId = 'assetId';
  const ctx = generateCtx({});

  getPermissions.mockResolvedValue({ permissions: { edit: false } });
  // Act
  const testFn = async () =>
    handlePermissions({
      assetId: mockAssetId,
      skipPermissions: true,
      ctx,
    });

  // Assert
  await expect(testFn()).resolves.not.toThrow();
});

it('Should not throw when the user is allowed to edit and flag skipPermissions is falsy', async () => {
  // Arrange
  const mockAssetId = 'assetId';
  const ctx = generateCtx({});

  getPermissions.mockResolvedValue({ permissions: { edit: true } });
  // Act
  const testFn = async () =>
    handlePermissions({
      assetId: mockAssetId,
      skipPermissions: false,
      ctx,
    });

  // Assert
  await expect(testFn()).resolves.not.toThrow();
});
