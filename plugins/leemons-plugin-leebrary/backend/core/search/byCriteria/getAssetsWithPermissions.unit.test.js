const { it, beforeAll, beforeEach, describe, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');
const getPermissionsMock = require('../../../__fixtures__/getPermissionsMocks');

jest.mock('../../permissions/getByAssets');
const { getByAssets: getPermissions } = require('../../permissions/getByAssets');

jest.mock('./filterByPublishStatus');
const { filterByPublishStatus } = require('./filterByPublishStatus');

describe('getAssetsWithPermissions', () => {
  const assetPermission = getPermissionsMock().permissionByAssetOne;
  let ctx;
  let assets;
  let assetPermissions;
  let nothingFound;
  let onlyShared;
  let preferCurrent;
  let published;
  let roles;
  let showPublic;

  beforeAll(() => {
    ctx = generateCtx({});
  });

  beforeEach(() => {
    assets = ['assetId1', 'assetId2'];
    assetPermissions = [
      { ...assetPermission, asset: 'assetId1' },
      { ...assetPermission, asset: 'assetId2' },
    ];
    nothingFound = false;
    onlyShared = false;
    preferCurrent = true;
    published = true;
    roles = ['rol1'];
    showPublic = true;
  });

  it('returns asset with permissions', async () => {
    // Arrange
    getPermissions.mockReturnValue(assetPermissions);
    filterByPublishStatus.mockReturnValue(assetPermissions);

    // Act
    const response = await getAssetsWithPermissions({
      assets,
      nothingFound,
      onlyShared,
      preferCurrent,
      published,
      roles,
      showPublic,
      ctx,
    });

    // Assert
    expect(getPermissions).toBeCalledWith({
      assetIds: assets,
      showPublic,
      onlyShared,
      ctx,
    });
    expect(filterByPublishStatus).toBeCalledWith({
      assets: assetPermissions,
      assetsWithPermissions: assetPermissions,
      nothingFound,
      preferCurrent,
      published,
      roles,
      ctx,
    });
    expect(response).toBe(assetPermissions);
  });

  it('returns asset without permissions if nothingFound is false', async () => {
    // Arrange
    filterByPublishStatus.mockReturnValue(assets);
    nothingFound = true;

    // Act
    const response = await getAssetsWithPermissions({
      assets,
      nothingFound,
      onlyShared,
      preferCurrent,
      published,
      roles,
      showPublic,
      ctx,
    });

    // Assert
    expect(getPermissions).not.toBeCalledWith();
    expect(filterByPublishStatus).toBeCalledWith({
      assets,
      assetsWithPermissions: [],
      nothingFound,
      preferCurrent,
      published,
      roles,
      ctx,
    });
    expect(response).toBe(assets);
  });
});
