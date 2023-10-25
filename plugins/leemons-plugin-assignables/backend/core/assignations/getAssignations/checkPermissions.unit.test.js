const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { checkPermissions } = require('./checkPermissions');
const { getServiceModels } = require('../../../models');

jest.mock(
  '../../permissions/instances/users/getUserPermissions/getUserPermissions'
);

const {
  getUserPermissions,
} = require('../../permissions/instances/users/getUserPermissions/getUserPermissions');

let mongooseConnection;
let disconnectMongoose;

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
});

it('Should check permissions correctly', async () => {
  // Arrange
  const assignationsData = [
    {
      id: 'assignation1',
      user: 'userAgentId',
      instance: 'instance1',
    },
    {
      id: 'assignation2',
      user: 'NOuserAgentId',
      instance: 'instance2',
    },
  ];
  const ctx = generateCtx({
    actions: {
      'users.users.getUserAgentsInfo': () => [{ id: 'user1' }],
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  getUserPermissions.mockImplementation(async () => ({
    instance1: { actions: ['view'] },
    instance2: { actions: ['edit'] },
  }));

  // Act
  const result = await checkPermissions({ assignationsData, ctx });

  // Assert
  expect(result).toBeDefined();
  expect(result).toHaveProperty('assignation1');
  expect(result.assignation1).toBe(true);
  expect(result.assignation2).toBe(true);
});
