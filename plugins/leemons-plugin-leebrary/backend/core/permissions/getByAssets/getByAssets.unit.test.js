const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: { fn, spyOn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');
const { escapeRegExp } = require('lodash');

const { getByAssets } = require('./getByAssets');
const { assetsSchema } = require('../../../models/assets');
const getUserSession = require('../../../__fixtures__/getUserSession');
const { permissionSeparator, rolesPermissions } = require('../../../config/constants');

// MOCKS
jest.mock('./handleItemPermissions');
const { handleItemPermissions } = require('./handleItemPermissions');

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
  id: 'permissionOne',
  permissionName: 'leebrary.(ASSET_ID)assetOne',
  target: 'categoryId',
  role: null,
  center: null,
  deleted: 0,
  deleted_at: null,
  actionNames: ['owner'],
};

it('Should get permissions by assets correctly for private and public assets allowing to retrieve only shared assets if needed', async () => {
  // Arrange
  const assetsIds = ['assetOne', 'assetTwo', 'assetThree', 'assetFour'];
  const userAgentPermissions = [{ ...getUserAgentPermissionsResult }];
  const getUserAgentPermissions = fn().mockResolvedValue(userAgentPermissions);
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = { ...userSession };

  const initialValues = assetsIds.map((id) => ({ id, public: false }));
  await ctx.db.Assets.create([...initialValues, { id: 'publicAsset', public: true }]);

  handleItemPermissions.mockResolvedValue([[assetsIds[2]], [assetsIds[1]], [assetsIds[3]]]);
  const expectedResult = [
    { asset: 'publicAsset', role: 'public', permissions: rolesPermissions.public },
    {
      asset: assetsIds[0],
      role: userAgentPermissions[0].actionNames[0],
      permissions: rolesPermissions.owner,
    },
    {
      asset: assetsIds[1],
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
    { asset: assetsIds[2], role: 'viewer', permissions: rolesPermissions.viewer },
    { asset: assetsIds[3], role: 'assigner', permissions: rolesPermissions.assigner },
  ];
  const onlyPrivateSharedExpectedResult = expectedResult.filter(
    (item) => item.role !== 'owner' && item.asset !== 'publicAsset'
  );

  // Act
  const response = await getByAssets({
    assetIds: [...assetsIds, 'publicAsset'],
    showPublic: true,
    ctx,
  });
  const onlyPrivateSharedResponse = await getByAssets({
    assetIds: [...assetsIds, 'publicAsset'],
    onlyShared: true,
    ctx,
  });

  // Assert
  expect(getUserAgentPermissions).toBeCalledWith({
    userAgent: userSession.userAgents,
    query: {
      $or: [...assetsIds, 'publicAsset'].map((id) => {
        const rx = escapeRegExp(ctx.prefixPN(permissionSeparator + id));
        return {
          permissionName: {
            $regex: rx,
            $options: 'i',
          },
        };
      }),
    },
  });
  expect(handleItemPermissions).toBeCalledWith({
    assetsIds: [...assetsIds, 'publicAsset'],
    userAgents: userSession.userAgents,
    ctx,
  });
  expect(response).toEqual(expect.arrayContaining(expectedResult));
  expect(response.length).toBe(expectedResult.length);
  expect(onlyPrivateSharedResponse).toEqual(
    expect.arrayContaining(onlyPrivateSharedExpectedResult)
  );
  expect(onlyPrivateSharedResponse.length).toBe(onlyPrivateSharedExpectedResult.length);
});

it('Should correctly set the role and its related permissions', async () => {
  // Arrange
  const assetsWithUAPermissions = ['assetOne', 'assetTwo', 'assetThree', 'assetFour', 'assetFive'];
  const userAgentPermissions = assetsWithUAPermissions.map((id, i) => ({
    ...getUserAgentPermissionsResult,
    id: `permission-${id}`,
    permissionName: `leebrary.${permissionSeparator}${id}`,
    actionNames: i % 2 === 0 ? ['viewer'] : [i < 2 ? 'editor' : 'assigner'],
  }));
  const assetsIds = [...assetsWithUAPermissions, 'assetSix'];
  const getUserAgentPermissions = fn().mockResolvedValue(userAgentPermissions);
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
    },
  });
  ctx.meta.userSession = { ...userSession };

  handleItemPermissions.mockResolvedValue([
    assetsIds.slice(-2),
    assetsIds.slice(0, 2),
    assetsIds.slice(2, 4),
  ]);
  const expectedResult = [
    {
      asset: assetsIds[0],
      role: 'editor',
      permissions: rolesPermissions.editor,
    },
    {
      asset: assetsIds[1],
      role: userAgentPermissions[1].actionNames[0],
      permissions: rolesPermissions.editor,
    },
    {
      asset: assetsIds[2],
      role: 'assigner',
      permissions: rolesPermissions.assigner,
    },
    {
      asset: assetsIds[3],
      role: userAgentPermissions[3].actionNames[0],
      permissions: rolesPermissions.assigner,
    },
    {
      asset: assetsIds[4],
      role: 'viewer',
      permissions: rolesPermissions.viewer,
    },
  ];

  // Act
  const response = await getByAssets({
    assetIds: [...assetsIds, 'publicAsset'],
    ctx,
  });

  // Assert
  expect(response).toEqual(expect.arrayContaining(expectedResult));
});

it('Should retrieve only public assets when no user session is passed', async () => {
  // Arrange
  const assetId = 'publicAssetId';
  const getUserAgentPermissions = fn();
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  delete ctx.meta.userSession;

  await ctx.db.Assets.create({ id: assetId, public: true });

  // Act
  const response = await getByAssets({ assetIds: [assetId], showPublic: true, ctx });
  const responseNoPublic = await getByAssets({ assetIds: [assetId], ctx });

  // Assert
  expect(getUserAgentPermissions).not.toBeCalled();
  expect(handleItemPermissions).not.toBeCalled();
  expect(response).toEqual([
    { asset: assetId, permissions: rolesPermissions.public, role: 'public' },
  ]);
  expect(responseNoPublic).toEqual([]);
});

it("Should catch any type of error and throw a leemons error with the error's information", async () => {
  // Arrange
  const errorMessage = 'Boom!';
  const getUserAgentPermissions = fn().mockImplementation(() => {
    throw new Error(errorMessage);
  });
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions': getUserAgentPermissions,
    },
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = { ...userSession };
  const spyLogger = spyOn(ctx.logger, 'error');

  // Act
  const testFnToThrow = async () => getByAssets({ ctx });

  // Assert
  try {
    await testFnToThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(500);
    expect(error.message).toEqual(expect.stringContaining(errorMessage));
    expect(spyLogger).toBeCalledWith(expect.any(Error));
  }
});
