const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleAddPermissionsToAsset } = require('./handleAddPermissionsToAsset');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');

// MOCKS
jest.mock('./addPermissionsToAsset');
const { addPermissionsToAsset } = require('./addPermissionsToAsset');

beforeEach(() => jest.resetAllMocks());

const { payloadToSetPermissionsByClass: payload } = getPermissionsMocks();

it('Should call handleAddPermissionsToAsset correctly', async () => {
  // Arrange
  const categoryId = 'categoryId';
  const assetOne = { id: 'assetOne', category: categoryId };
  const assetTwo = { id: 'assetTwo', category: categoryId };
  const ctx = generateCtx({});
  const params = {
    permissions: payload.permissions,
    assetIds: [assetOne.id, assetTwo.id],
    assetsDataById: { [assetOne.id]: { ...assetOne }, [assetTwo.id]: { ...assetTwo } },
    assetsRoleById: { [assetOne.id]: 'owner', [assetTwo.id]: 'assigner' },
  };
  const spyPromises = jest.spyOn(Promise, 'all');

  addPermissionsToAsset.mockResolvedValue('mocked value');

  // Act
  await handleAddPermissionsToAsset({ ...params, ctx });

  // Assert
  expect(addPermissionsToAsset).nthCalledWith(1, {
    id: assetOne.id,
    categoryId,
    permissions: params.permissions,
    assignerRole: 'owner',
    ctx,
  });
  expect(addPermissionsToAsset).nthCalledWith(2, {
    id: assetTwo.id,
    categoryId,
    permissions: params.permissions,
    assignerRole: 'assigner',
    ctx,
  });
  expect(spyPromises).toHaveBeenCalled();
});

it('Should await for promises only if necessary', async () => {
  // Arrange
  const permissions = {};
  const assetIds = [];
  const assetsDataById = {};
  const assetsRoleById = {};
  const ctx = {};

  const spyPromiseAll = jest.spyOn(Promise, 'all');

  // Act
  await handleAddPermissionsToAsset({
    permissions,
    assetIds,
    assetsDataById,
    assetsRoleById,
    ctx,
  });

  // Assert
  expect(spyPromiseAll).not.toHaveBeenCalled();
});
