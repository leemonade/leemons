const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { checkIfStudentIsOnInstance } = require('./checkIfStudentIsOnInstance');
const { getServiceModels } = require('../../../models');

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

it('Should return true if student is on instance', async () => {
  // Arrange
  const user = 'user-id';
  const instance = 'instance-id';

  const ctx = generateCtx({
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  await ctx.tx.db.Assignations.create({
    user,
    instance,
    classes: [],
    indexable: true,
  });

  // Act
  const result = await checkIfStudentIsOnInstance({ user, instance, ctx });

  // Assert
  expect(result).toBe(true);
});

it('Should return false if student is not on instance', async () => {
  // Arrange
  const user = 'user-id';
  const instance = 'instance-id';

  const ctx = generateCtx({
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  // Act
  const result = await checkIfStudentIsOnInstance({ user, instance, ctx });

  // Assert
  expect(result).toBe(false);
});
