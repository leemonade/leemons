const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getAssignationsOfInstance } = require('./getAssignationsOfInstance');
const { assignationsSchema } = require('../../../models/assignations');

let mongooseConnection;
let disconnectMongoose;

jest.mock('../getAssignations', () => ({
  getAssignations: () =>
    Promise.resolve([
      {
        instance: 'instance1',
        classes: JSON.stringify([]),
        metadata: JSON.stringify({}),
      },
      {
        instance: 'instance2',
        classes: JSON.stringify([]),
        metadata: JSON.stringify({}),
      },
      {
        instance: 'instance2',
        classes: JSON.stringify([]),
        metadata: JSON.stringify({}),
      },
    ]),
}));
jest.mock('../../permissions/instances/users');

const { getUserPermissions } = require('../../permissions/instances/users');

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

it('Should return error when all not edit', async () => {
  // Arrange
  const instances = ['instance1', 'instance2'];
  const ctx = generateCtx({
    actions: {
      'users.platform.getHostname': () => 'hostname',
      'users.platform.getHostnameApi': () => 'hostnameApi',
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        assignationsSchema
      ),
    },
  });

  getUserPermissions.mockImplementation(async () => ({
    instance1: { actions: ['view'] },
    instance2: { actions: ['edit'] },
  }));

  // Act and Assert
  await expect(
    getAssignationsOfInstance({ instances, details: true, ctx })
  ).rejects.toThrow();
});

it('Should return all assignations for given instances with details true', async () => {
  // Arrange
  const instances = ['instance1', 'instance2'];
  const ctx = generateCtx({
    actions: {
      'users.platform.getHostname': () => 'hostname',
      'users.platform.getHostnameApi': () => 'hostnameApi',
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        assignationsSchema
      ),
    },
  });

  getUserPermissions.mockImplementation(async () => ({
    instance1: { actions: ['edit'] },
    instance2: { actions: ['edit'] },
  }));

  // Act
  const assignations = await getAssignationsOfInstance({
    instances,
    details: true,
    ctx,
  });

  // Assert
  expect(assignations).toBeDefined();
});

it('Should return all assignations for given instances with details false', async () => {
  // Arrange
  const instances = ['instance1', 'instance2'];
  const ctx = generateCtx({
    actions: {
      'users.platform.getHostname': () => 'hostname',
      'users.platform.getHostnameApi': () => 'hostnameApi',
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        assignationsSchema
      ),
    },
  });

  getUserPermissions.mockImplementation(async () => ({
    instance1: { actions: ['edit'] },
    instance2: { actions: ['edit'] },
  }));

  // Mock studentsAssignations
  await ctx.tx.db.Assignations.create([
    {
      id: 'id1',
      deploymentID: 'deploymentID1',
      instance: 'instance1',
      indexable: true,
      user: 'user1',
      classes: JSON.stringify([]),
      metadata: JSON.stringify({}),
      emailSended: false,
      rememberEmailSended: true,
    },
    {
      id: 'id2',
      deploymentID: 'deploymentID2',
      instance: 'instance2',
      indexable: true,
      user: 'user2',
      classes: JSON.stringify([]),
      metadata: JSON.stringify({}),
      emailSended: false,
      rememberEmailSended: true,
    },
    {
      id: 'id3',
      deploymentID: 'deploymentID2',
      instance: 'instance2',
      indexable: true,
      user: 'user2',
      classes: JSON.stringify([]),
      metadata: JSON.stringify({}),
      emailSended: false,
      rememberEmailSended: true,
    },
  ]);

  // Act
  const assignationsMultiple = await getAssignationsOfInstance({
    instances,
    details: false,
    ctx,
  });
  const assignationsSingle = await getAssignationsOfInstance({
    instances: instances[0],
    details: false,
    ctx,
  });

  // Assert
  expect(assignationsSingle).toBeDefined();
  expect(assignationsMultiple).toBeDefined();
  expect(assignationsMultiple['instance1']).toBeDefined();
  expect(assignationsMultiple['instance2']).toBeDefined();
});
