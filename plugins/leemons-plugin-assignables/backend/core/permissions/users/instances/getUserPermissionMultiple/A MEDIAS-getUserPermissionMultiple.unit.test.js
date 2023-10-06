const { beforeEach, describe, test, expect } = require('@jest/globals');

const { newModel } = require('leemons-mongodb');
const { generateCtx, createMongooseConnection } = require('leemons-testing');

const { getUserPermissionMultiple } = require('./getUserPermissionMultiple');
const { classesSchema } = require('../../../../../models/classes');

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
      'users.permissions.getUserAgentPermissions': getUserAgentPermissionsHandler,
    },
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
    pluginName,
  });

  await ctx.tx.db.Classes.create(classes);
});

describe('getUserPermissionMultiple function', () => {
  test('should get user permissions successfully', async () => {
    // Arrange

    const mockParams = {
      assignableInstances: ['assignableId1', 'assignableId2'],
      ctx,
    };

    getUserAgentPermissionsHandler.mockReturnValue([
      {
        permissionName: 'assignable.assignableId1',
        actionNames: ['view', 'edit'],
      },
      {
        permissionName: 'assignable.assignableId2',
        actionNames: ['view'],
      },
    ]);

    // Act
    const resp = await getUserPermissionMultiple(mockParams);

    // Assert
    expect(getUserAgentPermissionsHandler).toHaveBeenCalledTimes(2);
    expect(resp).toEqual([
      {
        role: 'editor',
        actions: ['view', 'edit'],
        assignableInstance: 'assignableId1',
      },
      {
        role: 'viewer',
        actions: ['view'],
        assignableInstance: 'assignableId2',
      },
    ]);
  });
});
