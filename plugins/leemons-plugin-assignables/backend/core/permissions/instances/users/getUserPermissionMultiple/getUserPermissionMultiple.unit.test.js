const { beforeEach, describe, test, expect } = require('@jest/globals');

const { newModel } = require('@leemons/mongodb');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');

const { getUserPermissionMultiple } = require('./getUserPermissionMultiple');
const { classesSchema } = require('../../../../../models/classes');

const getUserAgentPermissionsHandler = jest.fn();

const classes = [
  {
    assignableInstance: 'instanceId1',
    class: 'classId1',
  },
  {
    assignableInstance: 'instanceId2',
    class: 'classId2',
  },
];

let mongooseConnection;
let disconnectMongoose;
let ctx;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
  jest.resetAllMocks();

  ctx = generateCtx({
    actions: {
      'users.permissions.getUserAgentPermissions':
        getUserAgentPermissionsHandler,
    },
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  await ctx.tx.db.Classes.create(classes);
});

describe('getUserPermissionMultiple function', () => {
  test('should get user permissions successfully', async () => {
    // Arrange

    const mockParams = {
      assignableInstances: 'instanceId1',
      ctx,
    };

    getUserAgentPermissionsHandler.mockReturnValueOnce([
      {
        permissionName: 'assignableInstance.instanceId1',
        actionNames: ['view', 'edit'],
      },
    ]);

    // Act
    const resp = await getUserPermissionMultiple(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toHaveBeenCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        $or: [
          {
            permissionName: {
              $options: 'i',
              $regex: 'assignableInstance\\.instanceId1',
            },
          },
        ],
      },
    });
    expect(resp).toEqual([
      {
        actions: ['edit', 'view'],
        assignableInstance: 'instanceId1',
        role: 'teacher',
      },
    ]);
  });

  test('should get user permissions successfully using class permissions', async () => {
    // Arrange

    const mockParams = {
      assignableInstances: ['instanceId1', 'instanceId2'],
      ctx,
    };

    getUserAgentPermissionsHandler
      .mockReturnValueOnce([
        {
          permissionName: 'assignableInstance.instanceId1',
          actionNames: ['view', 'edit'],
        },
      ])
      .mockReturnValueOnce([
        {
          permissionName: 'academic-portfolio.class.classId2',
          actionNames: ['edit'],
        },
      ]);

    // Act
    const resp = await getUserPermissionMultiple(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toHaveBeenCalledTimes(2);
    expect(resp).toEqual([
      {
        actions: ['edit', 'view'],
        assignableInstance: 'instanceId1',
        role: 'teacher',
      },
      {
        actions: ['edit', 'view'],
        assignableInstance: 'instanceId2',
        role: 'teacher',
      },
    ]);
  });

  test('should get student permissions if no teacher permissions found', async () => {
    // Arrange

    const mockParams = {
      assignableInstances: ['instanceId1', 'instanceId2'],
      ctx,
    };

    getUserAgentPermissionsHandler
      .mockReturnValueOnce([])
      .mockReturnValueOnce([]);

    // Act
    const resp = await getUserPermissionMultiple(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toHaveBeenCalledTimes(2);
    expect(resp).toEqual([
      { actions: ['view'], assignableInstance: 'instanceId1', role: 'student' },
      { actions: ['view'], assignableInstance: 'instanceId2', role: 'student' },
    ]);
  });
});
