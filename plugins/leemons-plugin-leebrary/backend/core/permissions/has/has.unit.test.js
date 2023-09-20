const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { has } = require('./has');
const { getByAsset } = require('../getByAsset');

jest.mock('../getByAsset');

beforeEach(() => jest.resetAllMocks());

it('should return true when all permissions are included', async () => {
  // Arrange
  const assetId = '123';
  const permissions = ['read', 'write'];
  const ctx = generateCtx({});

  getByAsset.mockResolvedValue({ read: true, write: true });

  // Act
  const result = await has({ assetId, permissions, ctx });

  // Assert
  expect(result).toBe(true);
});

it('should return false when not all permissions are included', async () => {
  // Arrange
  getByAsset.mockResolvedValue({ read: true });
  const assetId = '123';
  const permissions = ['read', 'write'];
  const ctx = generateCtx({});

  // Act
  const result = await has({ assetId, permissions, ctx });

  // Assert
  expect(result).toBe(false);
});

it('should throw an error when getByAsset throws an error', async () => {
  // Arrange
  const errorMessage = 'Error getting asset permissions.';
  getByAsset.mockRejectedValue(new Error(errorMessage));
  const assetId = '123';
  const permissions = ['read', 'write'];
  const ctx = generateCtx({});

  // Act
  try {
    await has({ assetId, permissions, ctx });
  } catch (error) {
    // Assert
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.message).toMatch(errorMessage);
  }
});
