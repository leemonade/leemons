const { it, expect, describe, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { filterByPublishStatus } = require('./filterByPublishStatus');
const getPermissionsMock = require('../../../__fixtures__/getPermissionsMocks');
const getAssets = require('../../../__fixtures__/getAssets');

const getVersionHandle = jest.fn();

describe('filterByPublishStatus', () => {
  const asset = getPermissionsMock().permissionByAsset;

  let ctx;
  let assets;
  let assetsWithPermissions;
  let assetsVersion;
  let nothingFound;
  let preferCurrent;
  let published;
  let roles;

  beforeEach(() => {
    ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': getVersionHandle,
      },
    });

    assets = [
      { ...asset, asset: 'asset1@2.0.0' },
      { ...asset, asset: 'asset2@2.0.0' },
    ];
    assetsWithPermissions = assets;
    assetsVersion = getAssets().assetsVersion;
    nothingFound = false;
    preferCurrent = true;
    published = 'all';
    roles = ['owner'];
  });

  describe('Intended workload', () => {
    it('should return assets with permissions', async () => {
      // Arrange
      getVersionHandle.mockReturnValue(assetsVersion);

      // Act
      const response = await filterByPublishStatus({
        assets,
        assetsWithPermissions,
        nothingFound,
        preferCurrent,
        published,
        roles,
        ctx,
      });

      // Assert
      expect(response).toEqual(assetsWithPermissions);
    });
  });

  describe('Limit use cases', () => {
    it('should return entry assets if nothingFound is true', async () => {
      // Arrange
      nothingFound = true;

      // Act
      const response = await filterByPublishStatus({
        assets,
        assetsWithPermissions,
        nothingFound,
        preferCurrent,
        published,
        roles,
        ctx,
      });

      // Assert
      expect(response).toEqual(assets);
    });

    it('should return empty array if roles are not included', async () => {
      // Arrange
      roles = ['role3'];

      // Act
      const response = await filterByPublishStatus({
        assets,
        assetsWithPermissions,
        nothingFound,
        preferCurrent,
        published,
        roles,
        ctx,
      });

      // Assert
      expect(response).toEqual([]);
    });
  });

  describe('Additional tests', () => {
    it('should return assets with permissions if published is not "all"', async () => {
      // Arrange
      published = true;

      // Act
      const response = await filterByPublishStatus({
        assets,
        assetsWithPermissions,
        nothingFound,
        preferCurrent,
        published,
        roles,
        ctx,
      });

      // Assert
      expect(response).toEqual([assetsWithPermissions[1]]);
    });
  });
  it('should return assets with permissions of not lastest version if preferCurrent is false', async () => {
    // Arrange
    preferCurrent = false;
    const newAssetsWithPermissions = assetsWithPermissions;
    newAssetsWithPermissions[0].asset = 'asset1@1.0.0';

    // Act
    const response = await filterByPublishStatus({
      assets,
      assetsWithPermissions: newAssetsWithPermissions,
      nothingFound,
      preferCurrent,
      published,
      roles,
      ctx,
    });

    // Assert
    expect(response).toEqual(newAssetsWithPermissions);
  });
});
