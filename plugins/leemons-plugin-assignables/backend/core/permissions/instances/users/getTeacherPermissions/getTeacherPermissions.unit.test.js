const { beforeEach, describe, test, expect } = require('@jest/globals');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getTeacherPermissions } = require('./getTeacherPermissions');
const { classesSchema } = require('../../../../../models/classes');

const getUserAgentPermissionsHandler = jest.fn();

const pluginName = 'assignables';
const classes = [
  {
    assignableInstance: 'assignableInstanceId1',
    class: 'classId1',
  },
  {
    assignableInstance: 'assignableInstanceId2',
    class: 'classId1',
  },
  {
    assignableInstance: 'assignableInstanceId2',
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

describe('getTeacherPermissions function', () => {
  test('should get teacher permissions successfully', async () => {
    // Arrange

    const mockParams = {
      instances: ['assignableInstanceId1', 'assignableInstanceId2'],
      ctx,
    };

    getUserAgentPermissionsHandler.mockResolvedValue([
      {
        permissionName: 'academic-portfolio.class.classId1',
        actionName: 'edit',
      },
      {
        permissionName: 'academic-portfolio.class.classId2',
        actionName: 'edit',
      },
    ]);

    // Act
    const resp = await getTeacherPermissions(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toBeCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        permissionName: expect.arrayContaining([
          'academic-portfolio.class.classId1',
          'academic-portfolio.class.classId2',
        ]),

        actionName: 'edit',
      },
    });
    expect(resp).toEqual({
      assignableInstanceId1: true,
      assignableInstanceId2: true,
    });
  });

  test('should return false if no permissions are found', async () => {
    // Arrange

    const mockParams = {
      instances: ['assignableInstanceId1', 'assignableInstanceId2'],
      ctx,
    };

    getUserAgentPermissionsHandler.mockResolvedValue([]);

    // Act
    const resp = await getTeacherPermissions(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toBeCalledWith({
      userAgent: ctx.meta.userSession.userAgents,
      query: {
        permissionName: expect.arrayContaining([
          'academic-portfolio.class.classId1',
          'academic-portfolio.class.classId2',
        ]),

        actionName: 'edit',
      },
    });
    expect(resp).toEqual({
      assignableInstanceId1: false,
      assignableInstanceId2: false,
    });
  });
});
