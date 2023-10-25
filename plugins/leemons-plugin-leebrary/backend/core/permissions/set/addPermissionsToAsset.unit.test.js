const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { escapeRegExp } = require('lodash');

const { addPermissionsToAsset } = require('./addPermissionsToAsset');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');

// MOCKS
jest.mock('../helpers/canAssignRole');
const canAssignRole = require('../helpers/canAssignRole');

beforeEach(() => jest.resetAllMocks());

const rolePermissionType = {
  editor: 'asset.can-edit',
  viewer: 'asset.can-view',
  assigner: 'asset.can-assign',
};
const pluginName = 'testing';

const {
  payloadToSetPermissionsByUser: payloadByUser,
  payloadToSetPermissionsByClass: payloadByClass,
} = getPermissionsMocks();

it('Should correctly add permissions to assets', async () => {
  // Arrange
  const params = {
    id: 'assetId',
    categoryId: 'categoryId',
    permissions: { ...payloadByClass.permissions, destroyer: ['notSupportedPermissionName'] },
    assignerRole: 'owner',
  };
  const findItemsAction = fn().mockResolvedValue();
  const removeItemsAction = fn();
  const addItemAction = fn();
  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItemsAction,
      'users.permissions.removeItems': removeItemsAction,
      'users.permissions.addItem': addItemAction,
    },
    pluginName,
  });
  const roles = Object.keys(params.permissions);
  const allPermissionsMock = [];
  roles.forEach((permission) => {
    if (params.permissions[permission].length) {
      allPermissionsMock.push(...params.permissions[permission]);
    }
  });

  canAssignRole.mockReturnValue(true);
  // Act
  await addPermissionsToAsset({ ...params, ctx });

  // Assert
  expect(findItemsAction).toBeCalledWith({
    params: {
      item: params.id,
      permissionName: allPermissionsMock,
      type: { $regex: `^${escapeRegExp(ctx.prefixPN('asset'))}` },
    },
  });
  expect(removeItemsAction).toBeCalledWith({
    query: {
      type: [
        ctx.prefixPN(rolePermissionType.editor),
        ctx.prefixPN(rolePermissionType.viewer),
        ctx.prefixPN(rolePermissionType.assigner),
      ],
      item: params.id,
      permissionName: allPermissionsMock,
    },
  });
  roles.forEach((role) => {
    if (role === 'destroyer') return;
    expect(addItemAction).toBeCalledWith({
      item: params.id,
      type: ctx.prefixPN(rolePermissionType[role]),
      data: params.permissions[role].length
        ? [
            {
              actionNames: ['view'],
              target: params.categoryId,
              permissionName: params.permissions[role][0],
            },
          ]
        : [],
      isCustomPermission: true,
    });
  });
  expect(addItemAction).toBeCalledTimes(3);
});

it('Should set permissions correctly when none are passed', async () => {
  // Arrange
  const findItemsAction = fn();
  const removeItemsAction = fn();
  const addItemAction = fn();
  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItemsAction,
      'users.permissions.removeItems': removeItemsAction,
      'users.permissions.addItem': addItemAction,
    },
  });

  const params = {
    id: 'assetId',
    categoryId: 'categoryId',
    permissions: payloadByUser.permissions,
    assignerRole: 'owner',
  };

  // Act
  await addPermissionsToAsset({ ...params, ctx });

  // Assert
  expect(findItemsAction).toBeCalledWith({
    params: {
      item: params.id,
      permissionName: [],
      type: { $regex: `^${escapeRegExp(ctx.prefixPN('asset'))}` },
    },
  });
  expect(removeItemsAction).toBeCalledWith({
    query: {
      type: [
        ctx.prefixPN(rolePermissionType.editor),
        ctx.prefixPN(rolePermissionType.viewer),
        ctx.prefixPN(rolePermissionType.assigner),
      ],
      item: params.id,
      permissionName: [],
    },
  });
  expect(addItemAction).toBeCalledWith({
    item: params.id,
    type: expect.any(String),
    data: [],
    isCustomPermission: true,
  });
});

it('Should throw when the user is not allowed to assign all the current permissions', async () => {
  // Arrange
  const payloadWithTwoPermissions = {
    ...payloadByClass,
    permissions: {
      viewer: ['academic-portfolio.class.classWhichViewsId'],
      editor: ['academic-portfolio.class.classWhichEditsId'],
      assigner: ['academic-portfolio.class.classWhichAssignsId'],
    },
  };
  const params = {
    id: 'assetId',
    categoryId: 'categoryId',
    permissions: payloadWithTwoPermissions.permissions,
    assignerRole: 'owner',
  };

  const findItemsAction = fn().mockResolvedValue([
    {
      permissionName: payloadWithTwoPermissions.permissions.viewer[0],
      actionNames: ['view'],
      target: params.categoryId,
      type: `${pluginName}.${rolePermissionType.viewer}`,
      item: params.id,
      center: null,
    },
    {
      permissionName: payloadWithTwoPermissions.permissions.editor[0],
      actionNames: ['view'],
      target: params.categoryId,
      type: `${pluginName}.${rolePermissionType.editor}`,
      item: params.id,
      center: null,
    },
    {
      permissionName: payloadWithTwoPermissions.permissions.assigner[0],
      actionNames: ['view'],
      target: params.categoryId,
      type: `${pluginName}.${rolePermissionType.assigner}`,
      item: params.id,
      center: null,
    },
  ]);

  const ctx = generateCtx({
    actions: {
      'users.permissions.findItems': findItemsAction,
    },
  });

  let timesCalled = 0;
  // Mock implementation to make the function throw
  canAssignRole.mockImplementation(() => {
    timesCalled++;
    return timesCalled < 3;
  });

  // Act
  try {
    await addPermissionsToAsset({ ...params, ctx });
  } catch (error) {
    // Assert
    expect(canAssignRole).toBeCalledTimes(3);
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(401);
  }
});
