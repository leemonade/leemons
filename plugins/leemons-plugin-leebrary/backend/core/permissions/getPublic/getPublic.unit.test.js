const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { getPublic } = require('./getPublic');
const { rolesPermissions } = require('../../../config/constants');

// MOCKS
jest.mock('../../assets/find');

const { find: findAsset } = require('../../assets/find');

beforeEach(() => jest.resetAllMocks());

it('Should call getPublic correctly', async () => {
  // Arrange
  const categoryId = 'categoryId';
  const publicAssets = [{ id: 'assetOne' }, { id: 'assetTwo' }];
  const expectedResponse = [
    { asset: publicAssets[0].id, role: 'public', permissions: rolesPermissions.public },
    { asset: publicAssets[0].id, role: 'public', permissions: rolesPermissions.public },
  ];

  const ctx = generateCtx({});
  findAsset.mockResolvedValue(publicAssets);
  // Act
  const response = await getPublic({ categoryId, ctx });
  // Assert
  expect(findAsset).toBeCalledWith({
    query: {
      public: true,
      indexable: true,
      category: categoryId,
    },
    ctx,
  });
  expect(response).toEqual(expect.arrayContaining(expectedResponse));
});

it('Should correctly construct a query where category and indexable fields are not needed', async () => {
  // Arrange
  const ctx = generateCtx({});
  findAsset.mockResolvedValue([]);

  // Act
  const response = await getPublic({ indexable: false, ctx });

  // Assert
  expect(findAsset).toBeCalledWith({
    query: {
      public: true,
      indexable: false,
    },
    ctx,
  });
  expect(response).toEqual([]);
});

it('Should only throw a LeemonsError error type providing information about it and a http status code', async () => {
  // Arrange
  const ctx = generateCtx({});
  const errorMsg = 'Some error';
  findAsset.mockImplementation(() => {
    throw new Error(errorMsg);
  });

  // Act & Assert
  try {
    await getPublic({ indexable: false, ctx });
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.message).toBe(`Failed to get permissions: ${errorMsg}`);
    expect(error.httpStatusCode).toBe(500);
  }
});
