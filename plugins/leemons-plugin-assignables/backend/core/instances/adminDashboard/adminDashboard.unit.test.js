// Importing required modules and functions
const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { assignablesSchema } = require('../../../models/assignables');
const { rolesSchema } = require('../../../models/roles');
const { instancesSchema } = require('../../../models/instances');

const {
  getAssignableObject,
} = require('../../../__fixtures__/getAssignableObject');
const { getRoleObject } = require('../../../__fixtures__/getRoleObject');
const {
  getInstanceObject,
} = require('../../../__fixtures__/getInstanceObject');

const { adminDashboard } = require('./adminDashboard');

let mongooseConnection;
let disconnectMongoose;

// Setting up the database connection before all tests
beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();
  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

// Disconnecting the database after all tests
afterAll(async () => {
  await disconnectMongoose();
  mongooseConnection = null;
  disconnectMongoose = null;
});

// Clearing the database before each test
beforeEach(async () => {
  await mongooseConnection.dropDatabase();
});

// Test case for adminDashboard function
it('Should handle adminDashboard correctly', async () => {
  // Arrange
  const { role } = getRoleObject();
  const assignable = {
    ...getAssignableObject(),
    id: 'assignableId',
    asset: 'assetId',
    role: role.name,
  };
  const instance = { ...getInstanceObject(), assignable: 'assignableId' };

  const ctx = generateCtx({
    models: {
      Assignables: newModel(
        mongooseConnection,
        'Assignables',
        assignablesSchema
      ),
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
  });

  await ctx.tx.db.Assignables.create(assignable);
  await ctx.tx.db.Roles.create(role);
  await ctx.tx.db.Instances.create(instance);

  // Act
  const response = await adminDashboard({ ctx });

  // Assert
  expect(response).toEqual({
    instances: [{ roleName: `assignables.roles.${role.name}`, instances: 1 }],
  });
});
