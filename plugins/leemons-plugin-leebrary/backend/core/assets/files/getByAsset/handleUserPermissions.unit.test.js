const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleUserPermissions } = require('./handleUserPermissions');
// MOCKS
jest.mock('../../../permissions/getByAsset');
const { getByAsset: getPermissions } = require('../../../permissions/getByAsset');

it('Should call getPermissions correctly to determine if the user has permission to view', async () => {
  // Arrange
  const assetId = '123';
  const ctx = generateCtx({});
  getPermissions.mockResolvedValue({ permissions: { view: true } });

  // Act
  const response = await handleUserPermissions({ assetId, ctx });

  // Assert
  expect(getPermissions).toBeCalledWith({ assetId, ctx });
  expect(response).toBe(true);
});

it('Should throw an error if the system cannot retreive permissions correctly', async () => {
  // Arrange
  const ctx = generateCtx({});
  getPermissions.mockResolvedValue({});

  // Act
  const testFunction = async () => handleUserPermissions({ assetId: '123', ctx });

  // Assert
  await expect(testFunction).rejects.toThrow();
});

it('Does not catch any error thrown by getPermissions', async () => {
  // Arrange
  const ctx = generateCtx({});
  const errorMessage = 'Failed to get permissions';
  getPermissions.mockRejectedValue(new Error(errorMessage));

  // Act
  const testFunction = async () => {
    await handleUserPermissions({ assetId: '123', ctx });
  };

  // Assert
  await expect(testFunction).rejects.toThrow(errorMessage);
});
