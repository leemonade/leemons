const { beforeEach, describe, test, expect } = require('@jest/globals');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getTeacherPermissions } = require('./getTeacherPermissions');
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

describe('getTeacherPermissions function', () => {
  test('should get teacher permissions successfully', async () => {
    // Arrange

    const mockParams = {
      assignableIds: ['assignableId1', 'assignableId2'],
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
      assignableId1: true,
      assignableId2: true,
    });
  });
});
