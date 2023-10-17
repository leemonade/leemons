const {
  it,
  expect,
  beforeEach,
  jest: { fn, spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleAssetIds } = require('./handleAssetIds');

beforeEach(() => jest.resetAllMocks());

const getUserAgentPermissionsResult = {
  id: 'permissionOne',
  permissionName: 'leemons-testing.(ASSET_ID)assetOne@1.0.0',
  target: 'categoryOne',
  role: null,
  center: null,
  deleted: 0,
  deleted_at: null,
  actionNames: ['owner'],
};

it('Should call hanleAssetIds correctly', async () => {
  // Arrange
  const permissions = [{ ...getUserAgentPermissionsResult }];
  const publicAssets = [{ asset: 'publicAssetId@1.0.0', role: 'public', permissions: {} }];
  const viewAssetId = 'assetIdView@1.0.0';
  const editAssetId = 'assetIdEdit@2.0.0';
  const categoryId = 'categoryOne';
  const listVersionsOfType = fn().mockResolvedValue([
    { fullId: 'assetIdEdit@1.0.0' },
    { fullId: editAssetId },
    { fullId: viewAssetId },
    { fullId: 'assetOne@1.0.0' },
    { fullId: publicAssets[0].asset },
  ]);

  const ctx = generateCtx({
    actions: {
      'common.versionControl.listVersionsOfType': listVersionsOfType,
    },
  });
  const sypLogger = spyOn(ctx.logger, 'error');
  const expectedResponse = ['assetOne@1.0.0', editAssetId, viewAssetId, publicAssets[0].asset];

  // Act
  const response = await handleAssetIds({
    permissions,
    publicAssets,
    viewItems: [viewAssetId],
    editItems: [editAssetId],
    categoryId,
    published: true,
    ctx,
  });

  // Assert
  expect(listVersionsOfType).toBeCalledWith({
    type: ctx.prefixPN(categoryId),
    published: true,
    preferCurrent: undefined,
  });
  expect(response).toEqual(expect.arrayContaining(expectedResponse));
  expect(response.length).toBe(expectedResponse.length);
  expect(sypLogger).not.toBeCalled();
});

it('Should not throw if something goes wrong in the system but inform about it', async () => {
  // Arrange
  const permissions = [];
  const publicAssets = [];
  const viewAssetId = 'assetIdView@1.0.0';
  const categoryId = 'categoryOne';
  const listVersionsOfType = fn().mockImplementation(() => {
    throw new Error();
  });

  const ctx = generateCtx({
    actions: {
      'common.versionControl.listVersionsOfType': listVersionsOfType,
    },
  });
  const sypLogger = spyOn(ctx.logger, 'error');

  // Act
  const result = await handleAssetIds({
    permissions,
    publicAssets,
    viewItems: [viewAssetId],
    editItems: [],
    categoryId,
    published: true,
    ctx,
  });

  // Assert
  expect(result).toEqual([viewAssetId]);
  expect(sypLogger).toBeCalledWith(expect.stringContaining(categoryId));
});
