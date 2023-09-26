/* eslint-disable sonarjs/no-duplicate-string */
const { it, expect } = require('@jest/globals');

const { handleOnlyShared } = require('./handleOnlyShared');

it('should return only shared permissions and asset IDs without owner permissions', () => {
  // Arrange
  const permissions = [
    { actionNames: ['owner'], permissionName: 'testing.(ASSET_ID)asset1' },
    { actionNames: ['view'], permissionName: 'testing.(ASSET_ID)asset2' },
    { actionNames: ['edit'], permissionName: 'testing.(ASSET_ID)asset3' },
  ];
  const assetsIds = ['asset1', 'asset2', 'asset3', 'asset4'];

  // Act
  const [newPermissions, newAssetsIds] = handleOnlyShared({ permissions, assetsIds });

  // Assert
  expect(newPermissions).toEqual([
    { actionNames: ['view'], permissionName: 'testing.(ASSET_ID)asset2' },
    { actionNames: ['edit'], permissionName: 'testing.(ASSET_ID)asset3' },
  ]);
  expect(newAssetsIds).toEqual(['asset2', 'asset3', 'asset4']);
});

it('should return empty arrays if no permissions are shared', () => {
  // Arrange
  const permissions = [
    { actionNames: ['owner'], permissionName: 'testing.(ASSET_ID)asset1' },
    { actionNames: ['owner'], permissionName: 'testing.(ASSET_ID)asset2' },
  ];
  const assetsIds = ['asset1', 'asset2'];

  // Act
  const [newPermissions, newAssetsIds] = handleOnlyShared({ permissions, assetsIds });

  // Assert
  expect(newPermissions).toEqual([]);
  expect(newAssetsIds).toEqual([]);
});

it('should return all permissions and asset IDs if all permissions are shared', () => {
  // Arrange
  const permissions = [
    { actionNames: ['view'], permissionName: 'testing.(ASSET_ID)asset1' },
    { actionNames: ['edit'], permissionName: 'testing.(ASSET_ID)asset2' },
  ];
  const assetsIds = ['asset1', 'asset2', 'asset3'];

  // Act
  const [newPermissions, newAssetsIds] = handleOnlyShared({ permissions, assetsIds });

  // Assert
  expect(newPermissions).toEqual(permissions);
  expect(newAssetsIds).toEqual(['asset1', 'asset2', 'asset3']);
});
