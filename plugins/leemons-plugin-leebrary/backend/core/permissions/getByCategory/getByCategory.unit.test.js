const {
  it,
  expect,
  beforeEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { getByCategory } = require('./getByCategory');
const getUserSession = require('../../../__fixtures__/getUserSession');

// MOCKS
jest.mock('./handlePermissions');
jest.mock('../getPublic/getPublic');
jest.mock('./handlePermissionsRoles');
jest.mock('./handleAssetIds');
jest.mock('../../search/byProvider');
jest.mock('../../assets/getAssetsByProgram');
jest.mock('../../assets/getAssetsBySubject');
jest.mock('./handleSorting');
jest.mock('./handleIndexable');
jest.mock('./handlePreferCurrent');
jest.mock('./handleViewerRole');
jest.mock('./handleEditorRole');
const { handlePermissions } = require('./handlePermissions');
const { getPublic } = require('../getPublic/getPublic');
const { handlePermissionsRoles } = require('./handlePermissionsRoles');
const { handleAssetIds } = require('./handleAssetIds');
const { byProvider: getByProvider } = require('../../search/byProvider');
const { getAssetsByProgram } = require('../../assets/getAssetsByProgram');
const { getAssetsBySubject } = require('../../assets/getAssetsBySubject');
const { handleSorting } = require('./handleSorting');
const { handleIndexable } = require('./handleIndexable');
const { handlePreferCurrent } = require('./handlePreferCurrent');
const { handleViewerRole } = require('./handleViewerRole');
const { handleEditorRole } = require('./handleEditorRole');

const userSession = getUserSession();
const assetFromPermissionId = 'assetFromUserAgentPermission';
const getUserAgentPermissionsResult = {
  id: 'permissionOne',
  permissionName: `leemons-testing.(ASSET_ID)${assetFromPermissionId}`,
  target: 'categoryOne',
  role: null,
  center: null,
  deleted: 0,
  deleted_at: null,
  actionNames: ['owner'],
};

beforeEach(() => jest.resetAllMocks());

it('Should call getByCategory correctly', async () => {
  // Arrange
  const categoryId = 'categoryOne';
  const permissions = [{ ...getUserAgentPermissionsResult }];
  const viewItems = ['view-assetId'];
  const editItems = ['edit-assetId'];
  const allAssetsIds = [assetFromPermissionId, viewItems[0], editItems[0]];
  const mockAccessiblesByAsset = [
    { asset: editItems[0], role: 'editor', permissions: {} },
    { asset: assetFromPermissionId, role: 'owner', permissions: {} },
    { asset: viewItems[0], role: 'viewer', permissions: {} },
  ];
  const expectedSortedResponse = [...mockAccessiblesByAsset].sort((a, b) =>
    a.asset.localeCompare(b.asset)
  );

  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };

  handlePermissions.mockResolvedValue([permissions, viewItems, editItems]);
  handleAssetIds.mockResolvedValue(allAssetsIds);
  handleSorting.mockResolvedValue(expectedSortedResponse);
  handlePermissionsRoles.mockReturnValue(mockAccessiblesByAsset);
  handleIndexable.mockResolvedValue(mockAccessiblesByAsset);

  // Act
  const response = await getByCategory({ categoryId, roles: ['assigner'], ctx });
  const sortBy = 'id';
  const sortedResponse = await getByCategory({
    categoryId,
    providerQuery: {},
    indexable: false,
    sortDirection: 'asc',
    sortBy,
    ctx,
  });

  // Assert
  expect(handlePermissions).toBeCalledWith({
    userSession,
    categoryId,
    ctx,
  });
  expect(getPublic).not.toBeCalled();
  expect(handleAssetIds).toBeCalledWith({
    permissions,
    publicAssets: [],
    viewItems,
    editItems,
    categoryId,
    published: true,
    preferCurrent: undefined,
    ctx,
  });
  expect(getByProvider).not.toBeCalled();
  expect(getAssetsByProgram).not.toBeCalled();
  expect(getAssetsBySubject).not.toBeCalled();
  expect(handleSorting).toBeCalledWith({
    assetIds: allAssetsIds,
    indexable: false,
    showPublic: undefined,
    userSession: ctx.meta.userSession,
    sortingBy: sortBy,
    sortDirection: 'asc',
    ctx,
  });
  expect(sortedResponse).toEqual(expectedSortedResponse);
  expect(handlePermissionsRoles).toBeCalledWith({
    permissions,
    roles: ['assigner'],
    assetIds: allAssetsIds,
    ctx,
  });
  expect(handleViewerRole).not.toBeCalled();
  expect(handleEditorRole).not.toBeCalled();
  expect(handleIndexable).toBeCalledWith({
    results: expect.any(Array),
    ctx,
  });
  expect(handleIndexable).toBeCalledTimes(1);
  expect(handlePreferCurrent).not.toBeCalled();
  expect(response).toEqual(mockAccessiblesByAsset);
});

it('Should correctly include public assets if needed', async () => {
  // Arrange
  const categoryId = 'categoryOne';
  const permissions = [{ ...getUserAgentPermissionsResult }];
  const viewItems = ['view-assetId'];
  const editItems = ['edit-assetId'];
  const publicAssetsResult = [
    { asset: 'publicAsset', role: 'public', permissions: {} },
    { asset: viewItems[0], role: 'public', permissions: {} },
  ];
  const allAssetsIds = [
    assetFromPermissionId,
    viewItems[0],
    editItems[0],
    publicAssetsResult[0].asset,
  ];
  const mockAccessiblesByAsset = [
    { asset: editItems[0], role: 'editor', permissions: {} },
    { asset: assetFromPermissionId, role: 'owner', permissions: {} },
    { asset: viewItems[0], role: 'viewer', permissions: {} },
  ];
  const expectedResults = [...mockAccessiblesByAsset, publicAssetsResult[0]];

  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };

  handlePermissions.mockResolvedValue([permissions, viewItems, editItems]);
  getPublic.mockResolvedValue(publicAssetsResult);
  handleAssetIds.mockResolvedValue(allAssetsIds);
  handlePermissionsRoles.mockReturnValue(mockAccessiblesByAsset);
  handleViewerRole.mockReturnValue(mockAccessiblesByAsset);
  handleEditorRole.mockReturnValue(mockAccessiblesByAsset);
  handleIndexable.mockResolvedValue(mockAccessiblesByAsset);

  // Act
  const response = await getByCategory({ categoryId, showPublic: true, ctx });

  // Assert
  expect(getPublic).toBeCalledWith({
    categoryId,
    indexable: true,
    ctx,
  });
  expect();
  expect(response).toEqual(expectedResults);
});

it('Should filter by programs and subjects and shape the result accordingly to indexable and version flags', async () => {
  // Arrange
  const categoryId = 'categoryOne';
  const viewItems = ['assetOne-view', 'assetTwo-view', 'assetThree-view'];
  const programs = ['programOne'];
  const subjects = ['subjectOne'];

  const mockAccessiblesByAsset = [{ asset: viewItems[2], role: 'viewer', permissions: {} }];
  const expectedResult = [{ ...mockAccessiblesByAsset[0], asset: 'currentVersionId' }];

  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };

  handlePermissions.mockResolvedValue([[], viewItems, []]);
  handleAssetIds.mockResolvedValue(viewItems);
  getAssetsByProgram.mockResolvedValue(viewItems.slice(-2));
  getAssetsBySubject.mockResolvedValue(viewItems.slice(-1));
  handlePermissionsRoles.mockReturnValue(mockAccessiblesByAsset);
  handleViewerRole.mockReturnValue(mockAccessiblesByAsset);
  handleEditorRole.mockReturnValue(mockAccessiblesByAsset);
  handlePreferCurrent.mockResolvedValue(expectedResult);

  // Act
  const response = await getByCategory({
    indexable: false,
    programs,
    subjects,
    categoryId,
    preferCurrent: true,
    roles: ['editor'],
    ctx,
  });

  // Assert
  expect(getAssetsByProgram).toBeCalledWith({
    program: programs,
    assets: viewItems,
    ctx,
  });
  expect(getAssetsBySubject).toBeCalledWith({
    subject: subjects,
    assets: viewItems.slice(-2),
    ctx,
  });
  expect(handlePermissionsRoles).toBeCalledWith({
    permissions: [],
    roles: ['editor'],
    assetIds: viewItems.slice(-1),
    ctx,
  });
  expect(handleIndexable).not.toBeCalled();
  expect(handlePreferCurrent).toBeCalledWith({
    results: mockAccessiblesByAsset,
    ctx,
  });
  expect(response).toEqual(expectedResult);
});

it('Should search in provider if needed and catch any related error that could be thrown', async () => {
  // Arrange
  const categoryId = 'categoryOne';
  const viewItems = ['assetOne-view', 'assetTwo-view'];
  const mockAccessiblesByAsset = [{ asset: viewItems[1], role: 'viewer', permissions: {} }];
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };
  const spyLogger = spyOn(ctx.logger, 'error');

  let getByProviderTimesCalled = 0;
  handlePermissions.mockResolvedValue([[], viewItems, []]);
  handleAssetIds.mockResolvedValue(viewItems);
  getByProvider.mockImplementation(() => {
    getByProviderTimesCalled++;
    if (getByProviderTimesCalled > 1) {
      throw new Error('Boom!');
    }
    return Promise.resolve([viewItems[1]]);
  });
  handlePermissionsRoles.mockReturnValue(mockAccessiblesByAsset);
  handleViewerRole.mockReturnValue(mockAccessiblesByAsset);
  handleEditorRole.mockReturnValue(mockAccessiblesByAsset);

  // Act
  const response = await getByCategory({
    indexable: false,
    searchInProvider: true,
    categoryId,
    ctx,
  });
  const testFnToFail = async () =>
    getByCategory({
      indexable: false,
      searchInProvider: true,
      categoryId,
      ctx,
    });

  // Assert
  expect(getByProvider).toBeCalledWith({
    categoryId,
    criteria: '',
    query: {},
    assets: viewItems,
    published: true,
    ctx,
  });
  expect(response).toEqual(mockAccessiblesByAsset);
  await expect(testFnToFail()).resolves.not.toThrow();
  expect(spyLogger).toBeCalledWith(expect.stringContaining('Boom!'));
});

it('Should throw a leemons error if something goes wrong', async () => {
  // Arrange
  const categoryId = 'categoryOne';
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };
  const errorMessage = 'Oops..';

  handlePermissions.mockRejectedValue(new Error(errorMessage));

  // Act
  const testFnToThrow = async () =>
    getByCategory({
      categoryId,
      ctx,
    });

  // Assert
  try {
    await testFnToThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(500);
    expect(error.message).toEqual(expect.stringContaining(errorMessage));
  }
});
