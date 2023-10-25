const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { escapeRegExp } = require('lodash');

const { removeMissingPermissions } = require('./removeMissingPermissions');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');

// MOCKS
jest.mock('../helpers/canUnassignRole');
const canUnassignRole = require('../helpers/canUnassignRole');

beforeEach(() => jest.resetAllMocks());

const rolePermissionType = {
  editor: 'asset.can-edit',
  viewer: 'asset.can-view',
  assigner: 'asset.can-assign',
};
const pluginName = 'testing';

const { payloadToRemoveAllPermissions: payload, itemPermission } = getPermissionsMocks();

it('Should call removeMissingPermissions correctly', async () => {
  // Arrange
  const asset = { id: 'assetOne' };
  const previousRoles = ['editor', 'assigner'];
  const previousPermissions = [
    {
      ...itemPermission,
      actionNames: [previousRoles[0]],
      item: asset.id,
      type: `${pluginName}.${rolePermissionType.editor}`,
      target: 'categoryIdWhichServesAsType',
    },
    {
      ...itemPermission,
      actionNames: [previousRoles[1]],
      item: asset.id,
      type: `${pluginName}.${rolePermissionType.assigner}`,
      target: 'categoryIdWhichServesAsType',
    },
  ];
  const newRoles = Object.keys(payload.permissions);
  const findItemsAction = fn().mockResolvedValue(previousPermissions);
  const removeItemsAction = fn();

  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItemsAction,
      'users.permissions.removeItems': removeItemsAction,
    },
    pluginName,
  });

  canUnassignRole.mockReturnValue(true);

  // Act
  await removeMissingPermissions({
    id: asset.id,
    permissions: payload.permissions,
    assignerRole: 'owner',
    ctx,
  });

  // Assert
  expect(findItemsAction).toBeCalledWith({
    params: {
      item: asset.id,
      permissionName: { $nin: [] },
      type: { $regex: `^${escapeRegExp(ctx.prefixPN('asset'))}` },
    },
  });
  expect(canUnassignRole).nthCalledWith(1, {
    userRole: 'owner',
    assignedUserCurrentRole: previousRoles[0],
    ctx,
  });
  expect(canUnassignRole).nthCalledWith(2, {
    userRole: 'owner',
    assignedUserCurrentRole: previousRoles[1],
    ctx,
  });
  newRoles.forEach((role) => {
    expect(removeItemsAction).toBeCalledWith({
      query: {
        item: asset.id,
        permissionName: { $nin: payload.permissions[role] },
        type: ctx.prefixPN(rolePermissionType[role]),
      },
    });
  });
});

it('Should throw LeemonsError when unassigning role is not allowed', async () => {
  // Arrange
  const asset = { id: 'assetOne' };
  const previousRoles = ['editor', 'assigner'];
  const previousPermissions = [
    {
      ...itemPermission,
      actionNames: [previousRoles[0]],
      item: asset.id,
      type: `${pluginName}.${rolePermissionType.editor}`,
      target: 'categoryIdWhichServesAsType',
    },
    {
      ...itemPermission,
      actionNames: [previousRoles[1]],
      item: asset.id,
      type: `${pluginName}.${rolePermissionType.assigner}`,
      target: 'categoryIdWhichServesAsType',
    },
  ];
  const findItemsAction = fn().mockResolvedValue(previousPermissions);
  const removeItemsAction = fn();

  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItemsAction,
      'users.permissions.removeItems': removeItemsAction,
    },
    pluginName,
  });

  canUnassignRole.mockReturnValue(false);

  // Act
  try {
    await removeMissingPermissions({
      id: asset.id,
      permissions: payload.permissions,
      assignerRole: 'owner',
      ctx,
    });
  } catch (error) {
    // Assert
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(401);
    expect(removeItemsAction).not.toBeCalled();
  }
});
