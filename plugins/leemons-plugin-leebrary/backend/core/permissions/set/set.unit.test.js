// // Use case: agregar permiso por usuario

const {
  it,
  expect,
  beforeEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { set } = require('./set');
const getAssets = require('../../../__fixtures__/getAssets');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');

// MOCKS
jest.mock('../../validations/forms');
jest.mock('../getByAssets');
jest.mock('../../assets/update');
jest.mock('./handleAddPermissionsToUserAgent');
jest.mock('./checkIfRolesExist');
jest.mock('../../assets/getByIds');
jest.mock('./handleAddPermissionsToAsset');
jest.mock('./handleRemoveMissingPermissions');
const { validateSetPermissions } = require('../../validations/forms');
const { getByAssets } = require('../getByAssets');
const { update: updateAsset } = require('../../assets/update');
const { handleAddPermissionsToUserAgent } = require('./handleAddPermissionsToUserAgent');
const { checkIfRolesExist } = require('./checkIfRolesExist');
const { getByIds } = require('../../assets/getByIds');
const { handleAddPermissionsToAsset } = require('./handleAddPermissionsToAsset');
const { handleRemoveMissingPermissions } = require('./handleRemoveMissingPermissions');

beforeEach(() => jest.resetAllMocks());

const { assetModel, assetDBExtraProps } = getAssets();
const {
  payloadToSetPermissionsByUser: payloadByUser,
  payloadToSetPermissionsByClass: payloadByClass,
  payloadToRemoveAllPermissions: payloadRemoveAll,
  permissionByAsset,
} = getPermissionsMocks();

it('Should correctly set permissions by user', async () => {
  // Arrange
  const assetData = {
    ...assetModel,
    assignable: undefined,
    downloadable: true,
    duplicable: 1,
    indexable: 1,
    pinned: false,
    permissions: { editor: [], viewer: [] },
    tags: [],
    ...assetDBExtraProps,
  };
  const assetIds = [assetData.id];
  const payload = { ...payloadByUser };
  const ctx = generateCtx({});
  const assetsRole = [{ ...permissionByAsset, asset: assetData.id }];

  getByAssets.mockResolvedValue(assetsRole);
  getByIds.mockResolvedValue([{ ...assetData }]);

  // Act
  const response = await set({
    assetId: assetData.id,
    ...payload,
    ctx,
  });

  // Assert
  expect(true).toBe(true);
  expect(validateSetPermissions).toBeCalledWith({
    assets: assetIds,
    permissions: payload.permissions,
    canAccess: payload.canAccess,
    isPublic: payload.isPublic,
  });
  expect(checkIfRolesExist).toBeCalledWith({
    canAccess: payload.canAccess,
    permissions: payload.permissions,
    ctx,
  });
  expect(getByAssets).toBeCalledWith({ assetIds, ctx });
  expect(getByIds).toBeCalledWith({ ids: assetIds, ctx });
  expect(updateAsset).not.toBeCalled();
  expect(handleAddPermissionsToUserAgent).toBeCalledWith({
    canAccess: payload.canAccess,
    assetIds,
    assetsDataById: { [assetData.id]: { ...assetData } },
    assetsRoleById: { [assetData.id]: assetsRole[0].role },
    ctx,
  });
  expect(handleAddPermissionsToAsset).toBeCalledWith({
    permissions: payload.permissions,
    assetIds,
    assetsDataById: { [assetData.id]: { ...assetData } },
    assetsRoleById: { [assetData.id]: assetsRole[0].role },
    ctx,
  });
  expect(response).toBe(true);
});

it('Should correctly set permissions by class', async () => {
  // Arrange
  const assetData = {
    ...assetModel,
    assignable: undefined,
    downloadable: true,
    duplicable: 1,
    indexable: 1,
    pinned: false,
    permissions: { editor: [], viewer: [] },
    tags: [],
    ...assetDBExtraProps,
  };
  const assetIds = [assetData.id];
  const payload = { ...payloadByClass };
  const ctx = generateCtx({});
  const assetsRole = [{ ...permissionByAsset, asset: assetData.id }];

  getByAssets.mockResolvedValue(assetsRole);
  getByIds.mockResolvedValue([{ ...assetData }]);

  // Act
  const response = await set({
    assetId: assetData.id,
    ...payload,
    ctx,
  });

  // Assert
  expect(true).toBe(true);
  expect(validateSetPermissions).toBeCalledWith({
    assets: assetIds,
    permissions: payload.permissions,
    canAccess: payload.canAccess,
    isPublic: payload.isPublic,
  });
  expect(checkIfRolesExist).toBeCalledWith({
    canAccess: payload.canAccess,
    permissions: payload.permissions,
    ctx,
  });
  expect(getByAssets).toBeCalledWith({ assetIds, ctx });
  expect(getByIds).toBeCalledWith({ ids: assetIds, ctx });
  expect(updateAsset).not.toBeCalled();
  expect(handleAddPermissionsToUserAgent).not.toBeCalled();
  expect(handleAddPermissionsToAsset).toBeCalledWith({
    permissions: payload.permissions,
    assetIds,
    assetsDataById: { [assetData.id]: { ...assetData } },
    assetsRoleById: { [assetData.id]: assetsRole[0].role },
    ctx,
  });
  expect(response).toBe(true);
});

it('Should validate the data and throw if necessary', async () => {
  const assetData = { ...assetModel };
  const payload = { ...payloadByUser };
  const ctx = generateCtx({});
  const spyLogger = spyOn(ctx.logger, 'error');

  validateSetPermissions.mockRejectedValue(new Error('I am a validator error'));

  // Act
  const testFnToThrow = async () =>
    set({
      assetId: [assetData.id, 888],
      isPublic: false,
      permissions: payload.permissions,
      canAccess: payload.canAccess,
      ctx,
    });

  // Assert
  await expect(testFnToThrow).rejects.toThrowError();
  expect(validateSetPermissions).toBeCalledWith({
    assets: [assetData.id, 888],
    permissions: payload.permissions,
    canAccess: payload.canAccess,
    isPublic: payload.isPublic,
  });
  expect(spyLogger).toHaveBeenCalledWith(expect.any(Error));
});

it('Should throw a Leemons error when the current user is not allowed to set the asset', async () => {
  // Arrange
  const assetData = {
    ...assetModel,
    public: true,
  };
  const payload = { ...payloadByUser };
  const ctx = generateCtx({});
  const assetsRole = [{ ...permissionByAsset, role: 'viewer', asset: assetData.id }];
  const spyLogger = spyOn(ctx.logger, 'error');

  getByAssets.mockResolvedValue(assetsRole);
  getByIds.mockResolvedValue([assetData]);

  try {
    // Act
    await set({ assetId: assetData.id, ...payload, ctx });
  } catch (error) {
    // Assert
    expect(spyLogger).toHaveBeenCalledWith(error);
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(412);
  }
});

it('Should correctly update asset permissions to be public when needed', async () => {
  // Arrange
  const assetData = {
    ...assetModel,
    assignable: undefined,
    downloadable: true,
    duplicable: 1,
    indexable: 1,
    pinned: false,
    permissions: { editor: [], viewer: [] },
    tags: [],
    ...assetDBExtraProps,
  };
  const assetIds = [assetData.id];
  const payload = { ...payloadByUser, isPublic: true };
  const ctx = generateCtx({});
  const assetsRole = [{ ...permissionByAsset, asset: assetData.id }];

  getByAssets.mockResolvedValue(assetsRole);
  getByIds.mockResolvedValue([{ ...assetData }]);

  // Act
  const response = await set({
    assetId: assetData.id,
    ...payload,
    ctx,
  });

  expect(updateAsset).toBeCalledWith({ data: { ...assetData, public: payload.isPublic }, ctx });
  expect(updateAsset).toBeCalledTimes(assetIds.length);
  expect(response).toBe(true);
});

it('Should correctly remove user and class permissions', async () => {
  // Arrange
  const payload = { ...payloadRemoveAll };
  const ctx = generateCtx({});
  const assetData = {
    ...assetModel,
    assignable: undefined,
    downloadable: true,
    duplicable: 1,
    indexable: 1,
    pinned: false,
    permissions: { editor: [], viewer: ['academic-portfolio.class.classId'], assigner: [] },
    tags: [],
    role: 'editor',
    ...assetDBExtraProps,
  };
  const assetIds = [assetData.id];
  const assetsRole = [{ ...permissionByAsset, asset: assetData.id }];

  getByAssets.mockResolvedValue(assetsRole);
  getByIds.mockResolvedValue([{ ...assetData }]);

  // Act
  const response = await set({
    assetId: assetData.id,
    ...payload,
    ctx,
  });

  // Arrange
  expect(handleAddPermissionsToUserAgent).not.toBeCalled();
  // This tests warranties that the exact behaviour of leemons-legacy remains, only that.
  expect(handleAddPermissionsToAsset).toBeCalledWith({
    permissions: payload.permissions,
    assetIds,
    assetsDataById: { [assetData.id]: { ...assetData } },
    assetsRoleById: { [assetData.id]: assetsRole[0].role },
    ctx,
  });
  expect(handleRemoveMissingPermissions).toBeCalledWith({
    canAccess: payload.canAccess,
    permissions: payload.permissions,
    assetIds,
    assetsRoleById: { [assetData.id]: assetsRole[0].role },
    ctx,
  });
  expect(response).toBe(true);
});

it('Should modify item permissions only if necessary', async () => {
  // Arrange
  const assetData = { ...assetModel };
  const payload = { ...payloadByUser, permissions: null };
  const ctx = generateCtx({});
  const assetsRole = [{ ...permissionByAsset, asset: assetData.id }];

  getByAssets.mockResolvedValue(assetsRole);
  getByIds.mockResolvedValue([{ ...assetData }]);

  // Act
  const response = await set({
    assetId: assetData.id,
    ...payload,
    ctx,
  });

  expect(handleAddPermissionsToAsset).not.toBeCalled();
  expect(response).toBe(true);
});
