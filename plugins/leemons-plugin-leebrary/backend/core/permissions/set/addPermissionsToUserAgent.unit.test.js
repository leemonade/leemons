const {
  it,
  expect,
  beforeEach,
  jest: { fn, spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { addPermissionsToUserAgent } = require('./addPermissionsToUserAgent');
const getUserSession = require('../../../__fixtures__/getUserSession');
const getPermissionsMocks = require('../../../__fixtures__/getPermissionsMocks');
const { permissionSeparator } = require('../../../config/constants');

// MOCKS
jest.mock('../getByAsset');
jest.mock('../helpers/canAssignRole');
const { getByAsset } = require('../getByAsset');
const canAssignRole = require('../helpers/canAssignRole');

beforeEach(() => jest.resetAllMocks());

const userSession = getUserSession();
const { userAgentPermissionForAnAsset } = getPermissionsMocks();

it('Should correctly add custom user agent permissions', async () => {
  // Arrange
  const removeCustomUserAgentPermissionAction = fn();
  const addCustomPermissionToUserAgentAction = fn().mockResolvedValue([
    { ...userAgentPermissionForAnAsset },
  ]);
  const expectedResultArray = [[{ ...userAgentPermissionForAnAsset }]];
  const ctx = generateCtx({
    actions: {
      'users.permissions.removeCustomUserAgentPermission': removeCustomUserAgentPermissionAction,
      'users.permissions.addCustomPermissionToUserAgent': addCustomPermissionToUserAgentAction,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const params = {
    id: 'assetId',
    role: 'viewer',
    userAgent: 'otherUserAgentId',
    categoryId: 'categoryId',
    assignerRole: 'owner',
    permissionName: ctx.prefixPN(`${permissionSeparator}assetId`),
  };
  const spyLogger = spyOn(ctx.logger, 'info');

  getByAsset.mockResolvedValue({});
  canAssignRole.mockReturnValue(true);

  // Act
  const response = await addPermissionsToUserAgent({ ...params, ctx });

  // Assert
  expect(getByAsset).toBeCalledWith({
    assetId: params.id,
    ctx: {
      ...ctx,
      meta: { ...ctx.meta, userSession: { userAgents: [{ id: params.userAgent }] } },
    },
  });
  expect(removeCustomUserAgentPermissionAction).toBeCalledWith({
    userAgentId: params.userAgent,
    data: { permissionName: params.permissionName },
  });
  expect(addCustomPermissionToUserAgentAction).toBeCalledWith({
    userAgentId: params.userAgent,
    data: {
      permissionName: params.permissionName,
      actionNames: [params.role],
      target: params.categoryId,
    },
  });
  expect(spyLogger).not.toHaveBeenCalled();
  expect(response).toEqual(expectedResultArray);
});

it('Should correctly assign owner permissions', async () => {
  // Arrange
  const removeCustomUserAgentPermissionAction = fn();
  let addTimesCalled = 0;
  const addCustomPermissionToUserAgentAction = fn().mockImplementation(() => {
    addTimesCalled++;
    if (addTimesCalled === 1) {
      // realmente devuelve esto { item: [{...}], ... }
      return Promise.resolve({
        items: [{}],
        count: 1,
        warnings: null,
      });
    }
    return [{ ...userAgentPermissionForAnAsset }];
  });

  const expectedResultArray = [
    {
      items: [{}],
      count: 1,
      warnings: null,
    },
    [{ ...userAgentPermissionForAnAsset }],
  ];
  const ctx = generateCtx({
    actions: {
      'users.permissions.removeCustomUserAgentPermission': removeCustomUserAgentPermissionAction,
      'users.permissions.addCustomPermissionToUserAgent': addCustomPermissionToUserAgentAction,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const params = {
    id: 'assetId',
    role: 'owner',
    userAgent: 'otherUserAgentId',
    categoryId: 'categoryId',
    assignerRole: 'owner',
    permissionName: ctx.prefixPN(`${permissionSeparator}assetId`),
  };

  getByAsset.mockResolvedValue({});
  canAssignRole.mockReturnValue(true);

  // Act
  const response = await addPermissionsToUserAgent({ ...params, ctx });

  // Assert
  expect(getByAsset).toBeCalledWith({
    assetId: params.id,
    ctx: {
      ...ctx,
      meta: { ...ctx.meta, userSession: { userAgents: [{ id: params.userAgent }] } },
    },
  });
  expect(removeCustomUserAgentPermissionAction).nthCalledWith(1, {
    userAgentId: [ctx.meta.userSession.userAgents[0].id],
    data: { permissionName: params.permissionName },
  });
  expect(removeCustomUserAgentPermissionAction).nthCalledWith(2, {
    userAgentId: params.userAgent,
    data: { permissionName: params.permissionName },
  });
  expect(addCustomPermissionToUserAgentAction).nthCalledWith(1, {
    userAgentId: [ctx.meta.userSession.userAgents[0].id],
    data: {
      permissionName: params.permissionName,
      actionNames: ['editor'],
      target: params.categoryId,
    },
  });
  expect(addCustomPermissionToUserAgentAction).nthCalledWith(2, {
    userAgentId: params.userAgent,
    data: {
      permissionName: params.permissionName,
      actionNames: [params.role],
      target: params.categoryId,
    },
  });
  expect(response).toEqual(expectedResultArray);
});

it('Should throw if the user cannot asign roles', async () => {
  // Arrange
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };
  const params = {
    id: 'assetId',
    role: 'viewer',
    userAgent: 'otherUserAgentId',
    categoryId: 'categoryId',
    assignerRole: 'owner',
    permissionName: ctx.prefixPN(`${permissionSeparator}assetId`),
  };

  getByAsset.mockResolvedValue({});
  canAssignRole.mockReturnValue(false);

  try {
    // Act
    await addPermissionsToUserAgent({ ...params, ctx });
  } catch (error) {
    // Assert
    expect(canAssignRole).toBeCalledWith({
      userRole: params.assignerRole,
      assignedUserCurrentRole: undefined,
      newRole: params.role,
      ctx,
    });
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(401);
  }
});

it('Shoud not throw when it fails adding a custom permission to an user agent but it should inform about it', async () => {
  const removeCustomUserAgentPermissionAction = fn();
  const addCustomPermissionToUserAgentAction = fn().mockImplementation(() => {
    throw new Error('Boom!');
  });
  const ctx = generateCtx({
    actions: {
      'users.permissions.removeCustomUserAgentPermission': removeCustomUserAgentPermissionAction,
      'users.permissions.addCustomPermissionToUserAgent': addCustomPermissionToUserAgentAction,
    },
  });
  ctx.meta.userSession = { ...userSession };
  const params = {
    id: 'assetId',
    role: 'viewer',
    userAgent: 'otherUserAgentId',
    categoryId: 'categoryId',
    assignerRole: 'owner',
    permissionName: ctx.prefixPN(`${permissionSeparator}assetId`),
  };
  const spyLogger = spyOn(ctx.logger, 'info');

  getByAsset.mockResolvedValue({});
  canAssignRole.mockReturnValue(true);

  // Act & Assert
  await expect(addPermissionsToUserAgent({ ...params, ctx })).resolves.not.toThrow();
  expect(spyLogger).toHaveBeenCalledWith(expect.stringMatching(`${params.userAgent}`));
});

it('Should return empty results if the role is already assigned', async () => {
  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };
  const params = {
    id: 'assetId',
    role: 'assigner',
    userAgent: 'otherUserAgentId',
    categoryId: 'categoryId',
    assignerRole: 'owner',
    permissionName: ctx.prefixPN(`${permissionSeparator}assetId`),
  };
  getByAsset.mockResolvedValue({ canAccessRole: 'assigner' });

  // Act
  const response = await addPermissionsToUserAgent({ ...params, ctx });

  // Assert
  expect(response).toEqual([]);
});
