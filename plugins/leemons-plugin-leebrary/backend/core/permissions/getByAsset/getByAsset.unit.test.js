/* eslint-disable sonarjs/no-duplicate-string */
const {
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');

const { getByAsset } = require('./getByAsset');
const { assetsSchema } = require('../../../models/assets');
const getUserSession = require('../../../__fixtures__/getUserSession');
const { permissionSeparator, rolesPermissions } = require('../../../config/constants');

let mongooseConnection;
let disconnectMongoose;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
  jest.resetAllMocks();
});

const userSession = getUserSession();

const getUserAgentPermissionsResult = {
  id: 'idOne',
  permissionName: 'leebrary.(ASSET_ID)assetOne',
  target: 'categoryId',
  role: null,
  center: null,
  deleted: 0,
  deleted_at: null,
  actionNames: ['viewer'],
};

it('Should correctly get permissions for asset private asset', async () => {
  // Arrange
  const asset = { id: 'assetOne' };
  const getUserAgentPermissions = fn().mockResolvedValue([
    { ...getUserAgentPermissionsResult },
    { ...getUserAgentPermissionsResult, permissionName: 'testing.(ASSET_ID)assetTwo' },
  ]);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockResolvedValue([]);
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const permissionTypes = {
    view: ctx.prefixPN('asset.can-view'),
    edit: ctx.prefixPN('asset.can-edit'),
    assign: ctx.prefixPN('asset.can-assign'),
  };

  const expectedPermissionName = ctx.prefixPN(permissionSeparator + asset.id);

  // Act
  const response = await getByAsset({ assetId: asset.id, ctx });

  // Assert
  expect(getUserAgentPermissions).toBeCalledWith({
    userAgent: userSession.userAgents,
    query: expect.objectContaining({ permissionName: expectedPermissionName }),
  });
  Object.keys(permissionTypes).forEach((type, i) => {
    expect(getAllItemsForTheUserAgentHasPermissionsByType).nthCalledWith(i + 1, {
      userAgentId: userSession.userAgents,
      type: permissionTypes[type],
      ignoreOriginalTarget: true,
      item: asset.id,
    });
  });
  expect(response).toEqual({
    role: getUserAgentPermissionsResult.actionNames[0],
    permissions: rolesPermissions.viewer,
    canAccessRole: 'viewer',
  });
});

it('Should get permissions for a public asset', async () => {
  // Arrange
  const asset = { id: 'assetOne', public: true };
  const getUserAgentPermissions = fn().mockResolvedValue([]);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockResolvedValue([]);
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = { ...userSession };
  await ctx.db.Assets.create({ ...asset });

  // Act
  const response = await getByAsset({ assetId: asset.id, ctx });

  // Assert
  expect(response).toEqual({
    role: 'public',
    permissions: rolesPermissions.public,
    canAccessRole: 'public',
  });
});

it('Should determine the correct role for an editor', async () => {
  // Arrange
  const asset = { id: 'assetOne' };
  const getUserAgentPermissions = fn().mockResolvedValue([
    {
      ...getUserAgentPermissionsResult,
      actionNames: ['viewer'],
    },
  ]);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockImplementation(({ type }) => {
    const response = type === 'leemons-testing.asset.can-edit' ? [asset.id] : [];
    return Promise.resolve(response);
  });
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
  });
  ctx.meta.userSession = { ...userSession };

  // Act
  const response = await getByAsset({ assetId: asset.id, ctx });

  // Assert
  expect(response).toEqual({
    role: 'editor',
    permissions: rolesPermissions.editor,
    canAccessRole: 'viewer',
  });
});

it('Should determine the correct role for a viewer', async () => {
  // Arrange
  const asset = { id: 'assetOne', public: false };
  const getUserAgentPermissions = fn().mockResolvedValue([]);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockImplementation(({ type }) => {
    const response = type === 'leemons-testing.asset.can-view' ? [asset.id] : [];
    return Promise.resolve(response);
  });
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = { ...userSession };
  await ctx.db.Assets.create({ ...asset });

  // Act
  const response = await getByAsset({ assetId: asset.id, ctx });

  // Assert
  expect(response).toEqual({
    role: 'viewer',
    permissions: rolesPermissions.viewer,
    canAccessRole: 'viewer',
  });
});

it('Should determine the correct role for an assigner', async () => {
  // Arrange
  const asset = { id: 'assetOne' };
  const getUserAgentPermissions = fn().mockResolvedValue([
    {
      ...getUserAgentPermissionsResult,
      actionNames: ['assigner'],
    },
  ]);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockImplementation(({ type }) => {
    const response = type === 'leemons-testing.asset.can-assign' ? [asset.id] : [];
    return Promise.resolve(response);
  });
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = { ...userSession };

  // Act
  const response = await getByAsset({ assetId: asset.id, ctx });

  // Assert
  expect(response).toEqual({
    role: 'assigner',
    permissions: rolesPermissions.assigner,
    canAccessRole: 'assigner',
  });
});

it('Should determine the correct role for an owner', async () => {
  // Arrange
  const asset = { id: 'assetOne' };
  const getUserAgentPermissions = fn().mockResolvedValue([
    {
      ...getUserAgentPermissionsResult,
      actionNames: ['owner'],
    },
  ]);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockImplementation(({ type }) => {
    const response = type === 'leemons-testing.asset.can-assigner' ? [asset.id] : [];
    return Promise.resolve(response);
  });
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = { ...userSession };

  // Act
  const response = await getByAsset({ assetId: asset.id, ctx });

  // Assert
  expect(response).toEqual({
    role: 'owner',
    permissions: rolesPermissions.owner,
    canAccessRole: 'owner',
  });
});

it('Should get permissions correctly for an user agent without permissions', async () => {
  // Arrange
  const asset = { id: 'assetOne', public: null };
  const getUserAgentPermissions = fn().mockResolvedValue([]);
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockResolvedValue([]);
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = { ...userSession };
  const permissionTypes = {
    view: ctx.prefixPN('asset.can-view'),
    edit: ctx.prefixPN('asset.can-edit'),
    assign: ctx.prefixPN('asset.can-assign'),
  };

  await ctx.db.Assets.create([{ ...asset }, { id: 'assetTwo', public: true }]);

  const expectedPermissionName = ctx.prefixPN(permissionSeparator + asset.id);

  // Act
  const response = await getByAsset({ assetId: asset.id, ctx });

  // Assert
  expect(getUserAgentPermissions).toBeCalledWith({
    userAgent: userSession.userAgents,
    query: expect.objectContaining({ permissionName: expectedPermissionName }),
  });
  Object.keys(permissionTypes).forEach((type, i) => {
    expect(getAllItemsForTheUserAgentHasPermissionsByType).nthCalledWith(i + 1, {
      userAgentId: userSession.userAgents,
      type: permissionTypes[type],
      ignoreOriginalTarget: true,
      item: asset.id,
    });
  });
  expect(response).toEqual({
    role: undefined,
    permissions: rolesPermissions.noPermission,
    canAccessRole: undefined,
  });
});

it('Should catch any error type and throw a Leemons Error with the error information', async () => {
  // Arrange
  const ctx = generateCtx({});

  // Act
  const testFnToThrow = async () => getByAsset({ ctx });

  // Arrange
  try {
    await testFnToThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(500);
  }
});
