const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { getByIds: getAssets } = require('../getByIds/getByIds');
const { getByCategory: getByPermissions } = require('../../permissions/getByCategory');
const { getPublicAssets } = require('./getPublicAssets');
const { getByCategory: getByUserAndCategory } = require('./getByUserAndCategory');

jest.mock('../../permissions/getByCategory');
jest.mock('../getByIds/getByIds');
jest.mock('./getPublicAssets');

it('should call getByPermissions, getAssets and getPublicAssets with correct arguments', async () => {
  // Arrange
  const ctx = generateCtx({});
  const params = {
    categoryId: 'testCategoryId',
    details: true,
    includePublic: true,
    indexable: true,
  };
  const mockByPermissions = [{ asset: 'byPermissionOne' }];
  const mockPublicAssets = [{ id: 'publicAssetOne' }];
  const mockAssets = [
    { ...mockByPermissions[0], otherProp: 'value' },
    { ...mockPublicAssets[0], otherProp: 'value for public asset' },
  ];

  getByPermissions.mockResolvedValue(mockByPermissions);
  getAssets.mockResolvedValue(mockAssets);
  getPublicAssets.mockResolvedValue(mockPublicAssets);

  // Act
  const result = await getByUserAndCategory({ ...params, ctx });

  // Assert
  expect(getByPermissions).toHaveBeenCalledWith({
    categoryId: params.categoryId,
    indexable: params.indexable,
    ctx,
  });
  expect(getPublicAssets).toHaveBeenCalledWith({
    includePublic: params.includePublic,
    categoryId: params.categoryId,
    indexable: params.indexable,
    ctx,
  });
  expect(getAssets).toHaveBeenCalledWith({
    ids: mockAssets.map((item) => item.id || item.asset),
    ctx,
  });
  expect(result).toEqual(mockAssets);
  result.forEach((asset) => expect(asset).toHaveProperty('otherProp'));
});

it('should return only asset ids when details flag is false', async () => {
  // Arrange
  const ctx = generateCtx({});
  const params = {
    categoryId: 'testCategoryId',
    includePublic: true,
    indexable: true,
    details: false,
  };
  const mockByPermissions = [{ asset: 'byPermissionOne' }];
  const mockPublicAssets = [{ id: 'publicAssetOne' }];
  const mockAssets = [{ ...mockByPermissions[0] }, { ...mockPublicAssets[0] }];

  getByPermissions.mockResolvedValue(mockByPermissions);
  getAssets.mockResolvedValue(mockAssets);
  getPublicAssets.mockResolvedValue(mockPublicAssets);

  // Act
  const result = await getByUserAndCategory({ ...params, ctx });

  // Assert
  expect(result).toEqual(mockAssets.map((item) => item.id || item.asset));
});

it('should not throw by missing optional values but it should when inner functions fail', async () => {
  // Arrange
  const ctx = generateCtx({});
  const params = {
    categoryId: 'testCategoryId',
  };

  getByPermissions.mockRejectedValue(new Error('Test Error'));

  // Act and Assert
  try {
    await getByUserAndCategory({ ...params, ctx });
  } catch (error) {
    expect(error instanceof LeemonsError).toBe(true);
    expect(error.message).toBe('Failed to get category assets: Test Error');
    expect(error.httpStatusCode).toBe(500);
  }
});
