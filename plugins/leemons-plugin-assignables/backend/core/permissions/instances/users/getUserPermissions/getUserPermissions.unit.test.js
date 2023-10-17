const { beforeEach, describe, test, expect } = require('@jest/globals');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getUserPermissions } = require('./getUserPermissions');
const { classesSchema } = require('../../../../../models/classes');

const { getTeacherPermissions } = require('../getTeacherPermissions');

jest.mock('../getTeacherPermissions');

const getUserAgentPermissionsHandler = jest.fn();

const pluginName = 'assignables';
const classes = [
  {
    assignable: 'assignableId1',
    class: 'classId1',
  },
  {
    assignable: 'assignableId2',
    class: 'classId1',
  },
  {
    assignable: 'assignableId2',
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
    pluginName,
  });

  await ctx.tx.db.Classes.create(classes);
});

describe('getUserPermissions function', () => {
  test('should get user permissions successfully', async () => {
    // Arrange
    getUserAgentPermissionsHandler.mockResolvedValue([
      {
        permissionName: 'prefix.assignableInstance.instanceId1',
        actionNames: ['view', 'edit'],
      },
      {
        permissionName: 'prefix.assignableInstance.instanceId2',
        actionNames: ['view'],
      },
    ]);

    const mockParams = {
      instancesIds: ['instanceId1', 'instanceId2'],
      ctx,
    };

    // Act
    const resp = await getUserPermissions(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toBeCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        $or: [
          {
            permissionName: {
              $options: 'i',
              $regex: 'assignableInstance\\.instanceId1',
            },
          },
          {
            permissionName: {
              $options: 'i',
              $regex: 'assignableInstance\\.instanceId2',
            },
          },
        ],
      },
    });
    expect(getTeacherPermissions).not.toBeCalled();
    expect(resp).toEqual({
      instanceId1: {
        actions: ['edit', 'view'],
        role: 'teacher',
      },
      instanceId2: {
        actions: ['view'],
        role: 'student',
      },
    });
  });

  test('should get user permissions successfully if there are instances without permissions', async () => {
    // Arrange

    getTeacherPermissions.mockResolvedValue({
      instanceId1: true,
      instanceId2: true,
    });

    const mockParams = {
      instancesIds: ['instanceId1', 'instanceId2'],
      ctx,
    };

    getUserAgentPermissionsHandler.mockResolvedValue([
      {
        permissionName: 'prefix.assignableInstance.instanceId1',
        actionNames: ['view', 'edit'],
      },
    ]);

    // Act
    const resp = await getUserPermissions(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toBeCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        $or: [
          {
            permissionName: {
              $options: 'i',
              $regex: 'assignableInstance\\.instanceId1',
            },
          },
          {
            permissionName: {
              $options: 'i',
              $regex: 'assignableInstance\\.instanceId2',
            },
          },
        ],
      },
    });
    expect(getTeacherPermissions).toBeCalledWith({
      instances: mockParams.instancesIds,
      ctx,
    });
    expect(resp).toEqual({
      instanceId1: {
        actions: ['edit', 'view'],
        role: 'teacher',
      },
      instanceId2: {
        actions: ['edit', 'view'],
        role: 'teacher',
      },
    });
  });
});
