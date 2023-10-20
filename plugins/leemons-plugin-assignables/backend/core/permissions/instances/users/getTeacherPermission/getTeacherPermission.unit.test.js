const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getTeacherPermission } = require('./getTeacherPermission');

const { listInstanceClasses } = require('../../../../classes');

jest.mock('../../../../classes');

const getUserAgentPermissionsHandler = jest.fn();

it('Should get Teacher Permissions', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions':
        getUserAgentPermissionsHandler,
    },
    pluginName: 'assignables',
  });

  const expectedValue = [
    {
      actionNames: ['view', 'edit'],
    },
  ];

  listInstanceClasses.mockResolvedValue([
    { class: 'classId1' },
    { class: 'classId2' },
  ]);
  getUserAgentPermissionsHandler.mockResolvedValue(['edit']);

  const mockParams = {
    assignableInstance: 'assignableInstanceId',
    ctx,
  };

  // Act
  const response = await getTeacherPermission(mockParams);

  // Assert
  expect(listInstanceClasses).toBeCalledWith({
    id: mockParams.assignableInstance,
    ctx,
  });
  expect(getUserAgentPermissionsHandler).toBeCalledWith({
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: [
        'academic-portfolio.class.classId1',
        'academic-portfolio.class.classId2',
      ],
      actionName: 'edit',
    },
  });
  expect(response).toEqual(expectedValue);
});

it('Should get empty array if no teacher permissions', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions':
        getUserAgentPermissionsHandler,
    },
    pluginName: 'assignables',
  });

  const expectedValue = [];

  listInstanceClasses.mockResolvedValue([
    { class: 'classId1' },
    { class: 'classId2' },
  ]);
  getUserAgentPermissionsHandler.mockResolvedValue([]);

  const mockParams = {
    assignableInstance: 'assignableInstanceId',
    ctx,
  };

  // Act
  const response = await getTeacherPermission(mockParams);

  // Assert
  expect(listInstanceClasses).toBeCalledWith({
    id: mockParams.assignableInstance,
    ctx,
  });
  expect(getUserAgentPermissionsHandler).toBeCalledWith({
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: [
        'academic-portfolio.class.classId1',
        'academic-portfolio.class.classId2',
      ],
      actionName: 'edit',
    },
  });
  expect(response).toEqual(expectedValue);
});
