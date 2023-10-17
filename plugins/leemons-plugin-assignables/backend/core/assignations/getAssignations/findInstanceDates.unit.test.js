const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { findInstanceDates } = require('./findInstanceDates');
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

it('Should find instance dates', async () => {
  // Arrange
  const instances = ['instance1', 'instance2'];
  const ctx = generateCtx({
    models: {
      Dates: newModel(
        mongooseConnection,
        'Dates',
        getServiceModels().Dates.schema
      ),
    },
  });

  await ctx.tx.db.Dates.create([
    {
      id: 'id1',
      type: 'assignableInstance',
      instance: 'instance1',
      name: 'name1',
      date: new Date(),
    },
  ]);

  // Act
  const result = await findInstanceDates({ instances, ctx });

  // Assert
  expect(result).toBeDefined();
  expect(result).toHaveProperty('instance1');
  expect(result.instance1).toHaveProperty('name1');
});
