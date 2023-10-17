const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handlePermissionsRoles } = require('./handlePermissionsRoles');
const { permissionSeparator, rolesPermissions } = require('../../../config/constants');

it('Should handle permission roles correctly when roles are not passed', () => {
  // Arrange
  const assetIds = ['assetOne', 'assetTwo'];
  const ctx = generateCtx({});
  const mockPermissions = [
    { permissionName: ctx.prefixPN(permissionSeparator + assetIds[0]), actionNames: ['viewer'] },
    { permissionName: ctx.prefixPN(permissionSeparator + assetIds[1]), actionNames: ['owner'] },
    { permissionName: ctx.prefixPN(`${permissionSeparator}otherAsset`), actionNames: ['editor'] },
  ];

  const expectedResponse = assetIds.map((id, i) => ({
    asset: id,
    role: mockPermissions[i].actionNames[0],
    permissions: rolesPermissions[mockPermissions[i].actionNames[0]],
  }));
  // Act
  const response = handlePermissionsRoles({ permissions: mockPermissions, assetIds, ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should filter its result when roles to check against are passed', () => {
  // Arrange
  const assetIds = ['assetOne', 'assetTwo'];
  const roles = ['owner', 'editor'];
  const ctx = generateCtx({});
  const mockPermissions = [
    { permissionName: ctx.prefixPN(permissionSeparator + assetIds[0]), actionNames: ['viewer'] },
    { permissionName: ctx.prefixPN(permissionSeparator + assetIds[1]), actionNames: ['owner'] },
  ];

  const expectedResponse = [
    {
      asset: assetIds[1],
      role: 'owner',
      permissions: rolesPermissions.owner,
    },
  ];
  // Act
  const response = handlePermissionsRoles({ permissions: mockPermissions, roles, assetIds, ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
});
